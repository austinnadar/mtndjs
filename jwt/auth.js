var expressJwt = require('express-jwt');
var unless = require('express-unless');


var express = require('express');
var router = express.Router();
var validate = express.Router();

var jwt = require('jsonwebtoken');

var secretKey = 'lskdfjLKJOLIJLKSksdkasj39039023';

var jwtCheck = expressJwt({ secret: secretKey });

jwtCheck.unless = unless;

module.exports = {

    configure: function(app) {

        router.post('/', function(req, res) {
            //retrieve here your user from a DB or a third party service
            // console.log('req'+ req);

            var username = req.body.username;
            var password = req.body.password;

            var user = require('../model/user');

            var users = user.verifyUser(res, username);
        });

        app.use('/authenticate', router);
        app.use(jwtCheck.unless('/authenticate'));
    }
}