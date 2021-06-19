# README #

This demonstrates the different logging patterns 

### Application Setup
- npm install
- node app.js 

### Make a call to application
- curl -v http://localhost:8889/multiFunctionCall
- curl -X POST http://localhost:8889/user

### Verify the logs

- A unique request-id logged with each API request.
- Multi function calls for an API - request-id remains same through-out.
- Multi Micro-service calls - The request-id for subsequent HTTP client call remains through-out.
  To demonstrate a multi-microservice call in the same service, we made a HTTP Client call (using axios) instead of a function call.

### Implement Logging for Microservices
- The middleware module needs to be a part of common module.
- All micro-service import will have to import the common module.


