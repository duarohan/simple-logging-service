const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
transports.DailyRotateFile = require('winston-daily-rotate-file');
var httpContext = require('express-http-context');

const myFormat = printf(({ level, message, timestamp }) => {
  var reqId = httpContext.get('reqId');
  return `${timestamp} [${reqId}] ${level}: ${message}`;
});

const opts = {
    filename: './logs/service-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    prepend: false,
    json: false,
    timestamp: true,
    handleExceptions: true,
    exitOnError: false,
  }

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
      new transports.DailyRotateFile(opts),
    ],
  });
  
module.exports = logger;
