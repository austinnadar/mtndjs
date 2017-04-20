var connection = require('../config/config'),
    jwt = require('jsonwebtoken'),
    secretKey = 'lskdfjLKJOLIJLKSksdkasj39039023',
    expressJwt = require('express-jwt'),
    jwtCheck = expressJwt({ secret: secretKey }),
    db = require('../utils/db');

var User = function() {

    this.verifyUser = function(res, userName) {

        if (userName)
            var sql = 'select * from user'
                // db.getData(sql, userName)
                //     .then(function(data) {
                //         if (result.length == 1) {
                //             var user = {
                //                 sgid: result[0].SGID,
                //                 firstname: result[0].FirstName,
                //                 lastname: result[0].LastName,
                //                 role: result[0].Role
                //             };

        //             // generate the jwt token with our user info
        //             var token = jwt.sign(user, secretKey, { expiresInMinutes: 120 });

        //             // the user object **is** included inside the token!

        //             res.json({
        //                 user: user, // this is only intended to get a reference in our extjs app
        //                 token: token
        //             });
        //         } else {
        //             res.status(401).send('User or password not valid');
        //         }
        //     }).catch(function(err) {
        //         res.status(404).send('Unexpected error');
        //     });

        return connection.acquire(function(err, con) {
            con.query('select * from user where SGID = ?', userName, function(err, result) {
                // console.log(result);
                con.release();
                if (err) {
                    console.log(err);
                    res.status(404).send('Unexpected error');
                } else {
                    //if(result.length >1)A
                    if (result.length == 1) {
                        console.log('reach', result[0]);

                        var user = {
                            sgid: result[0].SGID,
                            firstname: result[0].FirstName,
                            lastname: result[0].LastName,
                            role: result[0].Role
                        };

                        // generate the jwt token with our user info
                        var token = jwt.sign(user, secretKey, { expiresInMinutes: 120 });

                        // the user object **is** included inside the token!

                        res.json({
                            user: user, // this is only intended to get a reference in our extjs app
                            token: token
                        });
                        // return result[0];
                    } else {
                        res.status(401).send('User or password not valid');
                    }

                }
            })
        });
    }

    this.get = function(res) {
        connection.acquire(function(err, con) {
            con.query('select * from user', function(err, result) {
                con.release();
                res.send(result);
            });
        });
    };

    this.create = function(todo, res) {
        connection.acquire(function(err, con) {

            delete todo.id;
            console.log(todo);
            con.query('insert into user set ?', todo, function(err, result) {
                con.release();
                if (err) {
                    console.log(err);
                    res.send({ status: false, message: 'User creation failed' });
                } else {
                    res.send({ status: true, message: 'User created successfully' });
                }
            });
        });
    };

    this.update = function(todo, res) {
        connection.acquire(function(err, con) {
            console.log('in update');
            console.log(todo);
            con.query('update user set ? where SGID = ?', [todo, todo.SGID], function(err, result) {
                con.release();
                if (err) {
                    console.log(err);
                    res.send({ status: false, message: 'User update failed' });
                } else {
                    res.send({ status: true, message: 'User updated successfully' });
                }
            });
        });
    };

    this.delete = function(sgid, res) {
        connection.acquire(function(err, con) {
            console.log(sgid);
            con.query('delete from user where SGID = ?', [sgid], function(err, result) {
                con.release();
                if (err) {
                    res.send({ status: false, message: 'Failed to delete' });
                } else {
                    res.send({ status: true, message: 'Deleted successfully' });
                }
            });
        });
    };

}

module.exports = new User();