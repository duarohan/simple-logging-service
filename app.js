const express = require('express');
const routes = require('./routes');
const port = 8889;
const bodyParser = require('body-parser');
const accessLogger = require('./middleware/accessLogger')
const addMetaData = require('./middleware/addMetaData')
require('./middleware/interceptor').addRequestId(); 
var app = express();

app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(addMetaData)
app.use(accessLogger);
app.use(routes)

app.listen(port, () => console.log(`Universal log app listening on port ${port}!`))

module.exports = app