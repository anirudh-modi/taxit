const router = require('express').Router({ mergeParams: true });
const validator = require('validator');

const db = require('../../models');
const { getPlain, validationError, notFoundError } = require('../../util/helper');
const scheduler = require('../../util/scheduler');
const helper = require('./helper');

router.get('/', function (req, res, next) {
    const { tripId } = req.params;

    return db.Trips
        .findOne({
            where: {
                id: parseInt(tripId)
            }
        })
        .then(trip => {
            if (!trip) {
                throw notFoundError('Trip not found');
            }
            else {
                return res.json(getPlain(trip))
            }
        })
        .catch(next);
})

router.post('/start', function (req, res, next) {
    const { driverId } = req.query;
    const { tripId } = req.params;

    console.log(req.params);
    if (!driverId) {
        throw validationError('Driver id mandatory for starting a trip');
    }

    if (!validator.isInt(driverId)) {
        throw validationError('Invalid driver id');
    }

    if (!tripId) {
        throw validationError('Trip id mandatory for starting a trip');
    }

    if (!validator.isInt(tripId)) {
        throw validationError('Invalid trip id');
    }

    /**
     * Verify that the driver is not busy
     */
    db.Trips
        .findAll({
            where: {
                driver_id: parseInt(driverId),
                status: {
                    [db.Sequelize.Op.eq]: 'ONGOING'
                }
            }
        })
        .then(function (trips) {
            if (trips.length) {
                throw validationError('Driver is busy with an ongoing trip')
            }
        })
        .then(function () {
            return db.sequelize
                .query(
                    `UPDATE trips 
                        SET driver_id=${parseInt(driverId)}, picked_at='NOW()', status='ONGOING' 
                        WHERE id=${parseInt(tripId)} AND status='WAITING' AND driver_id is NULL RETURNING *;`);
        })
        .then(function (trip) {
            if (!trip[0].length) {
                throw validationError(`Trip already started by another driver`);
            }
            else {
                var timeStamp = Date.now() + parseInt(process.env.STOP_TIME_IN_MS);
                scheduler.set(timeStamp, helper.stopTrip);

                return trip[0];
            }
        })
        // TODO: Send emit to all driver and customer
        .then(updatedTrip => res.json(updatedTrip[0]))
        .catch(next)
});

router.post('/stop', function (req, res, next) {
    const { tripId } = req.params;

    if (!tripId) {
        throw validationError('Trip id mandatory for starting a trip');
    }

    if (!validator.isInt(tripId)) {
        throw validationError('Invalid trip id');
    }

    db.sequelize
        .query(
            `UPDATE trips 
                SET status='COMPLETED', completed_at='NOW()' 
                WHERE id=${parseInt(tripId)} AND status='ONGOING' RETURNING *;`)
        .then(function (trip) {
            if (!trip[0].length) {
                throw validationError(`Trip has already ended`);
            }
            else {
                return trip[0];
            }
        })
        // TODO: Send emit to all driver and customer about end trip
        .then(updatedTrip => res.json(updatedTrip[0]))
        .catch(next)
});

module.exports = router;