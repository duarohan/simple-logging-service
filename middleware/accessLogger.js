const fs = require('fs');
const morgan = require('morgan');
const fileStreamRotator = require('file-stream-rotator');

// Set up logging for express framework.  For Express we use morgan as it is
// officially supported by the Express team.  For our own logs, we use winston.
const logDirectory = './logs';
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fileStreamRotator.getStream({
  filename: `${logDirectory}/access.log`,
  frequency: 'daily',
  verbose: false,
});

morgan.token('request-id', (req) => {
    if(req.headers['x-request-id']){
        return req.headers['x-request-id'];
    }else{
        return req.requestMetadata;
    }
});

const accessLogger = morgan(':date[iso] [:request-id] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] '
               + '":referrer" ":user-agent" :response-time', { stream: accessLogStream });

module.exports = accessLogger;
