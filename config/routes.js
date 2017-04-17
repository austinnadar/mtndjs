var user = require('../model/user');
var project = require('../model/project');
var task = require('../model/task');
var upload = require('../others/uploads');
var timecard = require('../model/timecard');

module.exports = {
    configure: function(app) {
        app.get('/', function(req, res, next) {
            res.render('index', { title: 'Express' });
        });

        app.get('/', function(req, res, next) {
            res.send('respond with a resource');
        });


        app.options('/api/user/', function(req, res) {
            user.get(res);
        });

        app.get('/api/user/', function(req, res) {
            user.get(res);
        });


        //---------------------------------------------------
        //

        app.post('/api/upload/', function(req, res) {

            // console.log(req.file.size);
            upload.load(req, res, function(err) {

                console.log('it hit the link here' + req);
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
                    .on('json', function(data) {
                        // console.log(data.toString('utf8'));
                        // console.log(res);
                        // res.json(data.toString('utf8'));
                        jsons.push(data);
                    })
                    .on('done', function() {
                        res.json(jsons);
                    });
                // res.json(jsonData);
                // res.json({ error_code: 0, err_desc: null });
            });
        });

        app.post('/api/timecardupload/', function(req, res) {
            upload.load(req, res, function(err) {
                if (err) {
                    res.json({ error_code: 1, err_desc: err });
                    return;
                }
                var Converter = require('csvtojson').Converter,
                    converter = new Converter({}),
                    jsons = [];
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
            });
        });

        app.get('/api/timecardtask', function(req, res) {
            timecard.getTask(res);
        });

        app.get('/api/timecardproject', function(req, res) {
            timecard.getProject(res);
        });

        app.post('/api/projectupload/', function(req, res) {

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

        // app.get('/api/user/:sgid', function(req, res) {
        //     res.send({ status: 1, message: 'SGID' });
        //     // user.get(res);
        // });
        app.post('/api/user/', function(req, res) {
            user.create(req.body, res);
        });

        app.put('/api/user/:sgid/', function(req, res) {
            console.log('sgid');
            user.update(req.body, res);
        });

        app.delete('/api/user/:sgid/', function(req, res) {
            console.log(req.params)
            user.delete(req.params.sgid, res);
        });

        //-----------------------------------------
        app.options('/api/project/', function(req, res) {
            project.get(res);
        });

        app.get('/api/project/', function(req, res) {
            project.get(res);
        });

        app.get('/api/projectcode/', function(req, res) {
            project.getNameCode(res);
        });

        // app.get('/api/user/:sgid', function(req, res) {
        //     res.send({ status: 1, message: 'SGID' });
        //     // user.get(res);
        // });
        app.post('/api/project/', function(req, res) {
            project.create(req.body, res);
        });

        app.put('/api/project/:prid/', function(req, res) {
            project.update(req.body, res);
        });

        app.delete('/api/project/:prid/', function(req, res) {
            project.delete(req.params.prid, res);
        });

        //--------------------------------------------------------
        app.options('/api/task/', function(req, res) {
            task.get(res);
        });

        app.get('/api/task/:name/:date', function(req, res) {
            task.get(req.params, res);
        });

        app.get('/api/task/:name', function(req, res) {
            task.get(req.params, res);
        });

        app.post('/api/task/', function(req, res) {
            task.create(req.body, res);
        });

        app.put('/api/task/:prid/', function(req, res) {
            task.update(req.body, res);
        });

        app.delete('/api/task/:prid/', function(req, res) {
            task.delete(req.params.prid, res);
        });

    }
}
