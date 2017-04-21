var connection = require('../config/config'),
    Promise = require('bluebird');
/**
 * Database utility functions
 */
var db = function() {

    function getData(sql, data) {
        return new Promise(function(resolve, reject) {
            connection.acquire(function(err, con) {
                con.query(sql, data, function(err, result) {
                    con.release();
                    if (err) {
                        reject('Error in query');
                    } else {
                        resolve(result);
                    }
                });

            });
        })
    }

    function modifyData(sql, data) {
        return new Promise(function(resolve, reject) {
            connection.acquire(function(err, con) {
                con.query(sql, data, function(err, result) {
                    con.release();
                    if (err) {
                        reject('Failed to modify Data');
                    } else {
                        resolve('Modified successfylly');
                    }
                });

            });
        })
    }

    return {
        sendData: function(sql, data, res) {
            getData(sql, data)
                .then(function(result) {
                    res.send(result);
                })
                .catch(function(err) {
                    res.send(err);
                });
        },
        getData: getData,
        modifyData: function(sql, data, res) {
            modifyData(sql, data)
                .then(function(msg) {
                    res.send(msg);
                })
                .catch(function(err) {
                    res.send(err);
                });
        }
    }
}

module.exports = new db();