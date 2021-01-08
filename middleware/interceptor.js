const httpContext = require('express-http-context');
const axios = require('axios');

module.exports.addRequestId = () => {
    axios.interceptors.request.use(function (req) {
        req.headers['x-request-id'] = httpContext.get('reqId');
        return req;
    })
  };
