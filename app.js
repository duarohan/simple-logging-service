const express = require('express');
var uuid = require('node-uuid');
var httpContext = require('express-http-context');
const routes = require('./routes');
const port = 8889;
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(httpContext.middleware);
// Run the context for each request. Assign a unique identifier to each request

app.use(function(req, res, next) {
    if(req.headers['x-request-id']){
        httpContext.set('reqId', req.headers['x-request-id']);
    }else{
        const requestId = uuid.v1();
        httpContext.set('reqId', requestId);
        req.requestMetadata = requestId
    }
    next();
});

app.use(routes)

app.listen(port, () => console.log(`Universal log app listening on port ${port}!`))

module.exports = app