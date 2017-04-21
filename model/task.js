var connection = require('../config/config'),
    db = require('../utils/db');

var Task = function() {

    this.get = function(params, res) {
        // console.log(params);
        var sql, para;
        if (!params.date) {
            sql = 'select *,date_format(weekstartson,"%d-%m-%Y") as weekstartson from timecard where user = ? ';
            para = params.name;
        } else {

            sql = 'select *,date_format(weekstartson,"%d-%m-%Y") as weekstartson from timecard where user = ? and weekstartson = ?';
            para = [params.name, params.date];
            console.log(para);
        }

        db.sendData(sql, para, res);

    };

    this.create = function(task, res) {

        var sql = 'insert into task set ?';

        db.modifyData(sql, task, res);

        // connection.acquire(function(err, con) {

        //     // delete project.id;
        //     console.log(task);
        //     con.query('insert into task set ?', task, function(err, result) {
        //         con.release();
        //         if (err) {
        //             console.log(err);
        //             res.send({ status: false, message: 'Task creation failed' });
        //         } else {
        //             res.send({ status: true, message: 'Task created successfully' });
        //         }
        //     });
        // });
    };

    this.update = function(task, res) {
        connection.acquire(function(err, con) {
            console.log(task);
            con.query('update task set ? where TSKID = ?', [task, task.TSKID], function(err, result) {
                con.release();
                if (err) {
                    res.send({ status: false, message: 'Task update failed' });
                } else {
                    res.send({ status: true, message: 'Task updated successfully' });
                }
            });
        });
    };

    this.delete = function(id, res) {
        connection.acquire(function(err, con) {
            con.query('delete from task where TSKID = ?', [id], function(err, result) {
                con.release();
                if (err) {
                    res.send({ status: false, message: 'Failed to delete' });
                } else {
                    res.send({ status: true, message: 'Deleted successfully' });
                }
            });
        });
    };

    this.loadtask = function(json) {


    }

}

module.exports = new Task();