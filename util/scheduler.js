const schedule = require('node-schedule');

module.exports = {
    set: function (time, callback) {
        schedule.scheduleJob(new Date(time), callback);
    }
}

