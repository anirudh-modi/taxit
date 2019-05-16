const router = require('express').Router();
const validator = require('validator');
const db = require('../models');
const { getPlain, validationError, notFoundError } = require('../helper');

router.get('/:tripStatus(ALL|WAITING|ONGOING|COMPLETED)', function (req, res, next) {
    const { tripStatus } = req.params;
    const whereClause = {}

    if (tripStatus !== 'ALL') {
        whereClause.status = tripStatus;
    }

    return db
        .Trips
        .findAll({
            where: whereClause
        })
        .then(
            trips => res.json(trips
                .map(trip => getPlain(trip))
            )
        )
        .catch(next);
})

router.get('/:tripId', function (req, res, next) {
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

router.post('/', function (req, res, next) {
    const { customerId } = req.query;

    if (!customerId) {
        throw validationError('Customer id mandatory for creating a new trip');
    }

    if (!validator.isInt(customerId)) {
        throw validationError('Invalid customer id');
    }

    db.Trips
        .create({
            customer_id: parseInt(customerId)
        })
        // TODO: Send emit to drivers
        .then(trip => res.json(getPlain(trip)))
        .catch(next);
});

router.post('/:tripId/start', function (req, res, next) {
    const { driverId } = req.query;
    const { tripId } = req.params;

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
                return trip[0];
            }
        })
        // TODO: Start timer
        // TODO: Send emit to all driver and customer
        .then(updatedTrip => res.json(updatedTrip[0]))
        .catch(next)
});

router.post('/:tripId/stop', function (req, res, next) {
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
        // TODO: Start timer
        // TODO: Send emit to all driver and customer
        .then(updatedTrip => res.json(updatedTrip[0]))
        .catch(next)
});

module.exports = router;