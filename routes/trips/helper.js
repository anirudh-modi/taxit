const db = require('../../models');
const socketHandler = require('../../util/socketHandler');

function stopTrip(timeOfCompletion) {
    const timeOfCompletionInMs = new Date(timeOfCompletion).getTime() - parseInt(process.env.STOP_TIME_IN_MS);
    console.log('Finding trips to be marked as COMPLETED');

    db.sequelize
        .query(
            `UPDATE trips 
                SET status='COMPLETED', completed_at='NOW()' 
                WHERE status='ONGOING' AND picked_at <= (now() - INTERVAL '5 min') RETURNING *;`)
        .then(function (trip) {
            console.log(`${trip[0].length} [${trip[0].map(trip => trip.id).join(', ')}] trips were marked as completed`);
            socketHandler.sendEmit('Trip status change');
        })
        .catch(function (err) {
            console.log('Error while marking trips as COMPLETED', err)
        })
}

module.exports = {
    stopTrip
}