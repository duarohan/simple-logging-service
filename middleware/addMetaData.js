const uuidv4 = require('uuid/v4');
const httpContext = require('express-http-context');
const express = require('express');
const router = express.Router();

router.use(httpContext.middleware);

router.use(function(req, res, next) {
    if(req.headers['x-request-id']){
        httpContext.set('reqId', req.headers['x-request-id']);
    }else{
        const requestId = uuidv4();
        httpContext.set('reqId', requestId);
        req.requestMetadata = requestId
    }
    next();
});

module.exports = router;
