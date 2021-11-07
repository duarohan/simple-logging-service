const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
transports.DailyRotateFile = require('winston-daily-rotate-file');
var httpContext = require('express-http-context');
const path = require('path');
const PROJECT_ROOT = path.join(__dirname,'..')
const debug = require('debug')('logger');
const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const { createReadStream, createWriteStream } = require('fs');
const util = require('util');

const pipe = util.promisify(pipeline);
const deleteFile = util.promisify(fs.unlink);
const exec = util.promisify(require('child_process').exec);

const myFormat = printf(({ level, message, timestamp }) => {
  var reqId = httpContext.get('reqId');
  return `${timestamp} [${reqId}] ${level}: ${message}`;
});

const retentionPeriod = '15d';

function getStackInfo (stackIndex) {
  var stacklist = (new Error()).stack.split('\n').slice(3)

  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    }
  }
}

function formatLogArguments (args) {
  args = Array.prototype.slice.call(args)
  var stackInfo = getStackInfo(1)
  if (stackInfo) {
    // get file path relative to project root
    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'
    if (typeof (args[0]) === 'string') {
      args[0] = calleeStr + ' ' + args[0]
    } else {
      args.unshift(calleeStr)
    }
  }
  return args
}
const transport = new transports.DailyRotateFile({
  filename: './logs/service.log-%DATE%',
  datePattern: 'YYYY-MM-DD',
  prepend: false,
  json: false,
  timestamp: true,
  handleExceptions: true,
  exitOnError: false,
  maxFiles: retentionPeriod,
});

/**
 * Zipping the previous day file on each rotate also ensuring the retention Period of the files
 */

 transport.on('rotate', async (oldFilename) => {
  try {
    const retentionPeriodNum = retentionPeriod.split('d')[0];
    await exec(`find ${config.logging.directory} -type f -mtime +${retentionPeriodNum} -delete`);
    const gzip = createGzip();
    const source = createReadStream(oldFilename);
    const destination = createWriteStream(`${oldFilename}.gz`);
    await pipe(source, gzip, destination);
    await deleteFile(oldFilename);
  } catch (err) {
    debug(`MANUAL FIX REQUIRED!!! - Error in rotating file ${oldFilename} - ${util.inspect(err)}`);
  }
});

const logDirectory = './logs';
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

const logger = new createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    transport
  ],
});

logger.stream = {
  write: function (message) {
    logger.info(message)
  }
}
    
module.exports.debug = function debug() {
  logger.debug(...formatLogArguments(arguments));
};

module.exports.info = function info() {
  logger.info(...formatLogArguments(arguments));
};

module.exports.warn = function warn() {
  logger.warn(...formatLogArguments(arguments));
};

module.exports.error = function error() {
  logger.error(...formatLogArguments(arguments));
};

module.exports.stream = logger.stream  