const db = require('../../models');

function stopTrip(timeOfCompletion) {
    const timeOfCompletionInMs = new Date(timeOfCompletion).getTime() - parseInt(process.env.STOP_TIME_IN_MS);
    console.log('Finding trips to be marked as COMPLETED');

    db.sequelize
        .query(
            `UPDATE trips 
                SET status='COMPLETED', completed_at='NOW()' 
                WHERE status='ONGOING' AND picked_at <= (now() - INTERVAL '5 min') RETURNING *;`)
        .then(function (trip) {
            console.log(trip[0]);
        })
        .catch(function (err) {
            console.log('Error while marking trips as COMPLETED', err)
        })
}

module.exports = {
    stopTrip
}