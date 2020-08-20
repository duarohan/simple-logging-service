/**
 * Copyright (c) 2017 Square Panda Inc.
 * All Rights Reserved.
 * Dissemination, use, or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Square Panda Inc.
 * @Last modified by:   arjun
 *
 * Log utility for generating access logs.  Generates a middelware (Express) handler that is
 * used to generate access logs.  Relies upon the Morgan framework to do so.  Access logs are apache
 * style, with a few fields added on.
 */
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

// Configure access log using morgan.  Format is acpache access style, with a few additions.
// Access log should include X-Request-ID header, so set up custom token for this field.
morgan.token('request-id', (req) => {
    if(req.headers['x-request-id']){
        return req.headers['x-request-id'];
    }else{
        return req.requestMetadata;
    }
});

const accessLogger = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] '
               + '":referrer" ":user-agent" :request-id :response-time', { stream: accessLogStream });

module.exports = accessLogger;