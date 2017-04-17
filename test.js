var moment = require('moment'),
    dts = {
        PRID: 257,
        Task_ID: 'PRJTASK0010704',
        Description: '02 - ADA - Maintenance Evolutive',
        Start_Date: '13-01-2017',
        End_Date: '31-12-2017'
    };

var t = moment(dts.Start_Date,'DD-MM-YYYY');

console.log(t);
console.log(t.format('MM-DD-YYYY'));