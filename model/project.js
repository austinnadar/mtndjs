var connection = require('../config/config'),
    moment = require('moment');

var Project = function() {

    return {
        get: function(res) {
            connection.acquire(function(err, con) {
                con.query('select project.prid,project_name,task_id,projecttask.description,date_format(start_date,"%d-%m-%Y") as start_date,date_format(end_date,"%d-%m-%Y") as end_date from project inner join projecttask on project.prid = projecttask.prid ', function(err, result) {
                    con.release();
                    res.send(result);
                });
            });
        },
        getNameCode: function(res) {
            connection.acquire(function(err, con) {
                con.query('select PRID,Project_Name from project', function(err, result) {
                    con.release();
                    res.send(result);
                });
            });
        },
        create: function(project, res) {
            connection.acquire(function(err, con) {

                // delete project.id;
                // console.log(todo);
                con.query('insert into project set ?', project, function(err, result) {
                    con.release();
                    if (err) {
                        console.log(err);
                        res.send({ status: false, message: 'Project creation failed' });
                    } else {
                        res.send({ status: true, message: 'Prject created successfully' });
                    }
                });
            });
        },
        update: function(project, res) {
            connection.acquire(function(err, con) {
                con.query('update project set ? where PRID = ?', [project, project.PRID], function(err, result) {
                    con.release();
                    if (err) {
                        res.send({ status: false, message: 'Project update failed' });
                    } else {
                        res.send({ status: true, message: 'Project updated successfully' });
                    }
                });
            });
        },
        deletes: function(id, res) {
            connection.acquire(function(err, con) {
                con.query('delete from project where PRID = ?', [id], function(err, result) {
                    con.release();
                    if (err) {
                        res.send({ status: false, message: 'Failed to delete' });
                    } else {
                        res.send({ status: true, message: 'Deleted successfully' });
                    }
                });
            });
        },
        loadproject: function(data) {

            var arr = [];

            console.log(data);
            data.forEach(function(item) {
                console.log(arr.indexOf(item["Project Name"]));
                if (arr.indexOf(item["Project Name"]) == -1) {
                    arr.push(item["Project Name"]);
                }
            });
            console.log(arr);
            arr.forEach(function(item) {
                connection.acquire(function(err, con) {
                    con.query('select * from project where project_name = ?', con.escape(item), function(err, result) {
                        con.release();
                        if (err) {
                            // res.send({ status: false, message: 'Failed to delete' });
                            console.log('Query PRID Error');
                            console.log(con.escape(item["Project Name"]));
                        } else {
                            console.log(result);
                            if (result.length == 0) {
                                con.query('insert into project set ?', { 'project_name': item }, function(err, result) {
                                    // con.release();
                                    if (err) {
                                        console.log('Failed to inser new Project');
                                    } else {

                                    }
                                });
                            }
                        }
                    });
                });
            });
        },
        loadprojecttask: function(data) {
            // console.log(data);
            // 
            data.forEach(function(item) {

                connection.acquire(function(err, con) {

                    con.query('select * from project where project_name = ?', item["Project Name"], function(err, result) {
                        con.release();
                        if (err) {
                            // res.send({ status: false, message: 'Failed to delete' });
                            console.log('Query PRID Error');
                            // console.log(con.escape(item["Project Name"]));
                        } else {
                            console.log(item["Project Name"]);
                            if (result.length == 0) {
                                console.log('Proejct Not Found');
                            } else {

                                var prid = result[0].PRID,
                                    rec = {
                                        'PRID': prid,
                                        'Task_ID': item["Task"],
                                        'Description': item["Short Description"],
                                        "Start_Date": moment(item["Start date"],'DD-MM-YYYY').format('YYYY-MM-DD'),
                                        "End_Date": moment(item["End date"],'DD-MM-YYYY').format('YYYY-MM-DD')
                                    };
                                console.log(rec);

                                con.query('insert into projecttask set ?', rec, function(err, result) {
                                    // con.release();
                                    if (err) {
                                        console.log('Insert project task error ' + err);
                                        // console.log(err);
                                    } else {
                                        // console.log(result);
                                    }
                                });
                            }
                        }
                    });
                });
            });

        }
    }

}

module.exports = new Project();
