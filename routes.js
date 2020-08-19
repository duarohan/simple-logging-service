const router = require('express').Router()
const logger = require('./middleware/logger');
const userApi = require('./controller/userCreate')

router.get('/ping', function(req, res) {
    logger.info('Ping')
    return res.json({
        message: "Ping works",
        status: 200
    })
})

router.post('/user',userApi.createUser);
router.get('/user/:id',userApi.getUser);
router.get('/multiFunctionCall',userApi.multiFunctionCall);

module.exports = router