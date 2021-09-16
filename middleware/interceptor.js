const httpContext = require('express-http-context');
const axios = require('axios');

module.exports.addRequestId = () => {
    axios.interceptors.request.use(function (req) {
        const requestId = httpContext.get('reqId')
        if(requestId){
            req.headers['x-request-id'] = requestId
        }
        return req;
    })
  };
