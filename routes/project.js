var express = require('express'),
    router = express.Router(),
    project = require('../model/project');

router.options('/api/project/', function(req, res) {
    project.get(res);
});

router.get('/api/project/', function(req, res) {
    project.get(res);
});

router.get('/api/projectcode/', function(req, res) {
    project.getNameCode(res);
});

// app.get('/api/user/:sgid', function(req, res) {
//     res.send({ status: 1, message: 'SGID' });
//     // user.get(res);
// });
router.post('/api/project/', function(req, res) {
    project.create(req.body, res);
});

router.put('/api/project/:prid/', function(req, res) {
    project.update(req.body, res);
});

router.delete('/api/project/:prid/', function(req, res) {
    project.delete(req.params.prid, res);
});


router.post('/api/projectupload/', function(req, res) {

    // console.log(req.file.size);
    upload.load(req, res, function(err) {

        // console.log('it hit the link here' + req);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }

        /*console.log(req.file.path);
        var fread = require('fs'),
            data = fread.readFileSync(req.file.path),
            jsonData = JSON.parse(data);*/

        var Converter = require('csvtojson').Converter,
            converter = new Converter({}),
            jsons = [];
        converter.fromFile(req.file.path)
            .on('json', function(jsonObj) {
                jsons.push(jsonObj)
            })
            .on('done', function() {
                //res.json(jsons);

                project.loadproject(jsons);

                project.loadprojecttask(jsons);

            });
        // res.json(jsonData);
        res.json({ error_code: 0, err_desc: null });
    });
});

module.exports = router;