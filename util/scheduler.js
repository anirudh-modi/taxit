const schedule = require('node-schedule');

module.exports = {
    set: function (timeInMs, callback) {
        var date = new Date(timeInMs)

        console.log('Schedular will be called at ', date);
        schedule.scheduleJob(new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ), callback);
    }
}

