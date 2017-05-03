var express = require('express'),
    router = express.Router(),
    upload = require('../utils/uploads'),
    timecard = require('../model/timecard'),
    Converter = require('csvtojson').Converter;

router.put('/api/timecardupload/', function(req, res) {
    upload.load(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        var _conv = new Converter({}),
            _jsons = [];

        if (req.file) {
            _conv.fromFile(req.file.path)
                .on('json', function(jsonObj) {
                    _jsons.push(jsonObj)
                })
                .on('done', function() {
                    //res.json(jsons);
                    timecard.loadtimecard(_jsons, res);
                });

        }
    });
});

router.post('/api/timecardtask', function(req, res) {
    timecard.getTask(req.body.week, res);
});

router.post('/api/timecardproject', function(req, res) {
    timecard.getProject(req.body.week, res);
});

router.post('/api/timcardleave', function(req, res) {
    timecard.getLeave(req.body.week, res);
});


module.exports = router;