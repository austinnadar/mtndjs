var connection = require('../config/config'),
    moment = require('moment'),
    EventEmitter = require('events').EventEmitter,
    pivot = require('../utils/pivotTable')(),
    Promise = require('bluebird'),
    db = require('../utils/db');

TimeCard = function() {

    var Emitter = new EventEmitter();

    Emitter.on('BuildTask', function(data) {
        // console.log(data);
        var pvt = pivot.getTable(data.response, 'user', 'eff2'),
            res = data.res;
        res.send(pvt);
    });

    Emitter.on('ProjectPivot', function(data) {
        var pvt = pivot.getTable(data.response, 'Project_Name', 'util'), //pivotTask().getTask(data.response, 'Project_Name', 'util'),
            res = data.res;

        res.send(pvt);
    });

    return {
        getProject: function(week, res) {
            var sql = 'select table2.weekstartson,table2.Project_Name,sum(eff1)/(5*count(Project_Name))*100 as util' +
                ' from (select table1.weekstartson,table1.user,project.Project_Name,table1.eff1 from' +
                ' (select weekstartson,user,projecttask.prid, sum(efforts) as eff1 ' +
                ' from timecard join projecttask on timecard.task_id = projecttask.task_id ' +
                ' where  user in (select concat(lower(lastname),\', \', lower(firstname)) as users from user) ' +
                ' AND weekstartson IN (\'' + week.join('\',\'') + '\')' +
                ' group by weekstartson, user, projecttask.prid ) ' +
                ' as table1 join project on table1.prid = project.prid order by table1.weekstartson ) as table2 group by weekstartson,Project_Name ;'

            db.getData(sql)
                .catch(function(err) {
                    console.log(err);
                })
                .then(function(response) {
                    var d = {};

                    d.response = response,
                        d.res = res;

                    Emitter.emit('ProjectPivot', d);
                });
        },
        getTask: function(week, res) {

            var _sql = 'SELECT weekstartson, user, sum(eff1) as eff2 from (select weekstartson,user, lower(user) as usr,task_id, (sum(efforts)/5)*100 as eff1' +
                ' FROM timecard  group by weekstartson, user, task_id) as table1 where length(task_id) > 0 ' +
                ' AND table1.weekstartson IN (\'' + week.join('\',\'') + '\')' +
                ' AND  usr in (select concat(lower(lastname),\', \', lower(firstname)) as user from user)  group by weekstartson,user' +
                ' ORDER BY weekstartson,user;'

            db.getData(_sql)
                .then(function(_response) {
                    var d = {};
                    d['response'] = _response,
                        d['res'] = res;

                    Emitter.emit('BuildTask', d);

                }).catch(function(err) {
                    console.log(err);
                });

        },
        getLeave: function(week, res) {
            var sql = 'SELECT table1.weekstartson,table1.user,sum(table1.effort)as leaves  FROM (' +
                ' SELECT weekstartson,category,user, sum(efforts) AS effort' +
                ' FROM timecard WHERE task_id=\'\' AND category <> \'Meeting\'GROUP BY weekstartson, category, user) AS table1' +
                ' WHERE table1.weekstartson in (\'' + week.join('\',\'') + '\')' +
                ' AND  user in (SELECT CONCAT(LOWER(lastname),\', \', LOWER(firstname)) AS users FROM user) ' +
                ' GROUP BY table1.weekstartson,table1.user ORDER BY table1.user';

            db.getData(sql, null)
                .then(function(data) {
                    var _pvt = pivot.getTable(data, 'user', 'leaves');
                    res.send(_pvt);
                })
                .catch(function(err) {

                });
        },
        loadtimecard: function(data, res) {
            var promises = [],
                rec, hrs, days, tmpDate,
                weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            data.forEach(function(item) {
                // console.log(item);
                hrs = 0;
                for (var key in item) {
                    if (weekdays.indexOf(key) > -1) {
                        // console.log(key);
                        hrs = hrs + parseInt(item[key]);
                    }

                }
                tmpDate = moment(item["week_starts_on"], 'DD-MM-YYYY').format('YYYY-MM-DD');
                days = hrs / 8;
                item.days = days;

                rec = {
                    "WeekStartsOn": tmpDate,
                    "User": item.user.toLowerCase(),
                    "Category": item.category,
                    "Efforts": item.days,
                    "Task_Id": item.task,
                    "State": item.state
                };

                promises.push(db.modifyQ('insert into timecard set ?', rec));
            });

            Promise.all(promises)
                .then(function(data) {
                    res.json({ error_code: 0, err_desc: null });
                })
                .catch(function(err) {
                    res.json({ error_code: 0, err_desc: 'Failed to load' });
                })
        }
    }
}


module.exports = new TimeCard();