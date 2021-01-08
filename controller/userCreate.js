const logger = require('../middleware/logger');
const axios = require('axios');
const baseurl = 'http://localhost:8889';

exports.createUser = async function createUser(req, res, next){
    const id = 1;
    response = await axios({
        method: 'get',
        url: `${baseurl}/user/${id}`,
        headers : {'x-request-id': req.requestMetadata}
      });

    if(response.status == 200){
        logger.info('User Created with id',id)
        return res.status(200).json({message: "user Created"})        
    }
}

exports.getUser = async function getUser(req, res, next){ 
    logger.info('user Found',req.params)
    return res.status(200).json({message: "user Found"})
}

exports.multiFunctionCall = async function getUser(req, res, next){ 
    logger.info('Call Fn 1',fn())
    return res.status(200).json({message: "Call complete"})
}

function fn(){
    logger.info('Call Fn 2',fn2())
}

function fn2(){
    logger.info('Call Fn 3',fn3())
}

function fn3(){
    logger.info('return')
}