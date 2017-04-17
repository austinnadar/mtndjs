var connection = require('../config/config');    var multer = require('multer'),

        storage = multer.diskStorage({ //multers disk storage settings
            destination: function(req, file, cb) {
                cb(null, './uploads/');
                console.log('helel');
            },
            filename: function(req, file, cb) {
                var datetimestamp = Date.now();
                console.log('save');
                cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
            }
        }),

        upload = multer({ //multer settings
            storage: storage
        }).single('file');

    return {
        load: upload
    }
}

module.exports = new Upload();