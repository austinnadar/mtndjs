var express = require('express'),
    router = express.Router(),
    task = require('../model/task');


router.options('/api/task/', function(req, res) {
    task.get(res);
});

router.get('/api/task/:name/:date', function(req, res) {
    task.get(req.params, res);
});

router.get('/api/task/:name', function(req, res) {
    task.get(req.params, res);
});

router.post('/api/task/', function(req, res) {
    task.create(req.body, res);
});

router.put('/api/task/:prid/', function(req, res) {
    task.update(req.body, res);
});

router.delete('/api/task/:prid/', function(req, res) {
    task.delete(req.params.prid, res);
});

module.exports = router;