var connection = require('../config/config'),
    jwt = require('jsonwebtoken'),
    secretKey = 'lskdfjLKJOLIJLKSksdkasj39039023',
    expressJwt = require('express-jwt'),
    jwtCheck = expressJwt({ secret: secretKey }),
    db = require('../utils/db');

var User = function() {

    this.verifyUser = function(res, userName) {
        if (userName) {
            var sql = 'select * from user where SGID =?'
            db.getData(sql, userName)
                .then(function(data) {
                    if (data.length == 1) {
                        var user = {
                            sgid: data[0].SGID,
                            firstname: data[0].FirstName,
                            lastname: data[0].LastName,
                            role: data[0].Role
                        };

                        // generate the jwt token with our user info
                        var token = jwt.sign(user, secretKey, { expiresInMinutes: 120 });
                        res.json({
                            user: user,
                            token: token
                        });
                    } else {
                        res.status(401).send('User or password not valid');
                    }
                }).catch(function(err) {
                    res.status(404).send('Unexpected error');
                });
        } else {
            res.status(404).send('Unexpected error');
        }
    }

    this.get = function(res) {
        var sql = 'select * from user';
        db.sendData(sql, null, res);
    };
    this.create = function(user, res) {
        var sql = 'insert into user set ?';
        db.modifyData(sql, user, res);
    };
    this.update = function(user, res) {
        var sql = 'update user set ? where SGID = ?';
        db.modifyData(sql, [user, user.SGID], res);
    };
    this.delete = function(sgid, res) {
        var sql = 'delete from user where SGID = ?';
        db.modifyData(sql, [sgid], res);
    };
}

module.exports = new User();