var express = require('express'),
    router = express.Router(),
    user = require('../model/user');

router.options('/api/user/', function(req, res) {
    user.get(res);
});

router.get('/api/user/', function(req, res) {
    user.get(res);
});

router.post('/api/user/', function(req, res) {
    user.create(req.body, res);
});

router.put('/api/user/:sgid/', function(req, res) {
    console.log('sgid');
    user.update(req.body, res);
});

router.delete('/api/user/:sgid/', function(req, res) {
    console.log(req.params)
    user.delete(req.params.sgid, res);
});

module.exports = router;