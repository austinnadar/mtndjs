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

            var users = user.verifyUser(res,username);
            // console.log('test' + users);

            // if (!(username === 'hello' && password === 'world')) {
            //     console.log('User Name' + username);
            //     res.status(401).send('User or password not valid');
            //     //res.json(req.body);
            // } else {

            //     var user = {
            //         name: 'Hello World',
            //         email: 'hello@world.com',
            //         id: 999
            //     };

            //     // generate the jwt token with our user info
            //     var token = jwt.sign(user, secretKey, { expiresInMinutes: 120 });

            //     // the user object **is** included inside the token!

            //     res.json({
            //         user: user, // this is only intended to get a reference in our extjs app
            //         token: token
            //     });
            // }
        });

        // validate.post('/',function(req,res){
        //     var token = req.body.token;

        // });
        // app.use('/api', expressJwt({ secret: secretKey }));
        app.use('/authenticate', router);
        app.use(jwtCheck.unless('/authenticate'));
    }
}
