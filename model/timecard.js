var connection = require('../config/config'),
    moment = require('moment'),
    EventEmitter = require('events').EventEmitter,
    pivot = require('../utils/pivotTable'),
    db = require('../utils/db');


var TimeCard = function() {

    var Emitter = new EventEmitter();

    Emitter.on('BuildTask', function(data) {
        // console.log(data);
        var pvt = pivotTask().getTask(data.response, 'user', 'eff2'),
            res = data.res;
        res.send(pvt);
    });

    Emitter.on('ProjectPivot', function(data) {
        var pvt = pivotTask().getTask(data.response, 'Project_Name', 'util'),
            res = data.res;

        res.send(pvt);
    });


    function pivotTask() {
        var task = [],
            user = [],
            week = [],
            addUser = function(usr) {
                user.push(usr);
                task.push({ Name: usr, week: null });
            },
            hasUser = function(usr) {
                return user.indexOf(usr) == -1;
            },
            addWeek = function(weeks) {
                if (hasWeek(weeks))
                    week.push(weeks);

                task.forEach(function(item) {
                    if (!item.week) {
                        item.week = {};
                        item.week[weeks] = 0;
                    }
                    /*else{
                                            item.week[weeks] = 0;
                                        }*/
                })
            },
            hasWeek = function(weeks) {
                return week.indexOf(weeks) == -1;
            },
            updateData = function(usr, wk, data) {
                task.forEach(function(item) {
                    if (item.Name == usr) {
                        item.week[wk] = data;
                    }
                });
            };

        return {
            getTask: function(data, row, column) {
                data.forEach(function(item) {

                    weeks = moment(item["weekstartson"], 'DD-MM-YYYY').format('YYYY-MM-DD');

                    (hasUser(item[row])) ? addUser(item[row]): null;
                    //(hasUser(item['user'])) ? addUser(item['user']): null;

                    addWeek(weeks);

                    updateData(item[row], weeks, item[column]);

                });

                var tsk = {};
                tsk.task = task;
                tsk.week = week;
                tsk.user = user;
                return tsk;
            }
        }
    }

    return {
        getProject: function(res) {
            var sql = 'select table2.weekstartson,table2.Project_Name,sum(eff1)/(5*count(Project_Name))*100 as util' +
                ' from (select table1.weekstartson,table1.user,project.Project_Name,table1.eff1 from' +
                ' (select weekstartson,user,projecttask.prid, sum(efforts) as eff1 ' +
                ' from timecard join projecttask on timecard.task_id = projecttask.task_id ' +
                ' where  user in (select concat(lower(lastname),\' \', lower(firstname)) as users from user) ' +
                ' group by weekstartson, user, projecttask.prid ) ' +
                ' as table1 join project on table1.prid = project.prid order by table1.weekstartson ) as table2 group by weekstartson,Project_Name ;'

            db.getData(sql)
                .catch(function(err) {
                    console.log(err);
                })
                .then(function(response) {
                    var d = {};
                    d['response'] = response,
                        d['res'] = res;

                    Emitter.emit('ProjectPivot', d);
                });
        },
        getTask: function(res) {

            var times,
                sql = 'select weekstartson, user, sum(eff1) as eff2 from (select weekstartson,user, lower(user) as usr,task_id, (sum(efforts)/5)*100 as eff1' +
                ' from timecard  group by weekstartson, user, task_id) as table1 where length(task_id) > 0 ' +
                ' and  usr in (select concat(lower(lastname),\' \', lower(firstname)) as user from user)  group by weekstartson,user;';

            db.getData(sql)
                .then(function(response) {
                    var d = {};
                    d['response'] = response,
                        d['res'] = res;

                    Emitter.emit('BuildTask', d);

                }).catch(function(err) {
                    console.log(err);
                });

        },
        get: function(res) {
            connection.acquire(function(err, con) {
                con.query('select project.prid,project_name,task_id,projecttask.description,date_format(start_date,"%d-%m-%Y") as start_date,date_format(end_date,"%d-%m-%Y") as end_date from project inner join projecttask on project.prid = projecttask.prid ', function(err, result) {
                    con.release();
                    res.send(result);
                });
            });
        },
        getUser: function(res) {
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

        loadtimecard: function(data) {

            var arr = [],
                rec, hrs, days,
                weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

            data.forEach(function(item) {
                console.log(item);

                hrs = 0;
                for (var key in item) {
                    if (weekdays.indexOf(key) > -1) {
                        console.log(key);
                        hrs = hrs + parseInt(item[key]);
                    }

                }
                console.log(hrs);
                days = hrs / 8;
                item.days = days;

                connection.acquire(function(err, con) {
                    rec = {
                        "WeekStartsOn": moment(item["week_starts_on"], 'DD-MM-YYYY').format('YYYY-MM-DD'),
                        "User": item["user"],
                        "Category": item["category"],
                        "Efforts": item["days"],
                        "Task_Id": item["task"],
                        "State": item["state"]
                    };

                    // console.log(rec);
                    con.query('insert  into timecard set ?', rec, function(err, result) {

                        con.release();
                        if (err) {
                            // res.send({ status: false, message: 'Failed to delete' });
                            console.log('Insert Error' + err);
                        } else {
                            // console.log(result);

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
                                        "Start_Date": moment(item["Start date"], 'DD-MM-YYYY').format('YYYY-MM-DD'),
                                        "End_Date": moment(item["End date"], 'DD-MM-YYYY').format('YYYY-MM-DD')
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

module.exports = new TimeCard();