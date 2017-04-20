var express = require('express'),
    router = express.Router(),
    upload = require('../utils/uploads'),
    timecard = require('../model/timecard');

router.post('/api/timecardupload/', function(req, res) {
    upload.load(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        var Converter = require('csvtojson').Converter,
            converter = new Converter({}),
            jsons = [];

        if (req.file) {
            converter.fromFile(req.file.path)
                .on('json', function(jsonObj) {
                    jsons.push(jsonObj)
                })
                .on('done', function() {
                    //res.json(jsons);

                    timecard.loadtimecard(jsons);

                });
            // res.json(jsonData);
            res.json({ error_code: 0, err_desc: null });
        }
    });
});

router.get('/api/timecardtask', function(req, res) {
    timecard.getTask(res);
});

router.get('/api/timecardproject', function(req, res) {
    timecard.getProject(res);
});

module.exports = router;