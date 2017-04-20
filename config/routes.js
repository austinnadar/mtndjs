module.exports = {
    configure: function(app) {
        // app.get('/', function(req, res, next) {
        //     res.render('index', { title: 'Managment' });
        // });

        // app.get('/', function(req, res, next) {
        //     res.send('respond with a resource');
        // });
        //---------------------------------------------------
        //

        app.use(require('../routes/users'));

        app.use(require('../routes/timecard'));

        app.use(require('../routes/project'));

        app.use(require('../routes/task'));

        // app.post('/api/upload/', function(req, res) {

        //     // console.log(req.file.size);
        //     upload.load(req, res, function(err) {

        //         console.log('it hit the link here' + req);
        //         if (err) {
        //             res.json({ error_code: 1, err_desc: err });
        //             return;
        //         }

        //         /*console.log(req.file.path);
        //         var fread = require('fs'),
        //             data = fread.readFileSync(req.file.path),
        //             jsonData = JSON.parse(data);*/

        //         var Converter = require('csvtojson').Converter,
        //             converter = new Converter({}),
        //             jsons = [];
        //         converter.fromFile(req.file.path)
        //             .on('json', function(data) {
        //                 // console.log(data.toString('utf8'));
        //                 // console.log(res);
        //                 // res.json(data.toString('utf8'));
        //                 jsons.push(data);
        //             })
        //             .on('done', function() {
        //                 res.json(jsons);
        //             });
        //         // res.json(jsonData);
        //         // res.json({ error_code: 0, err_desc: null });
        //     });
        // });



    }
}