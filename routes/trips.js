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
        .findOne({
            where: {
                id: parseInt(tripId),
                status: 'WAITING',
                driver_id: null
            }
        })
        .then(function (trip) {
            if (!trip) {
                throw validationError(`Trip already started by another driver`);
            }
            else {
                return trip
                    .update({
                        driver_id: parseInt(driverId),
                        picked_at: new Date(),
                        status: 'ONGOING'
                    })
            }
        })
        // TODO: Start timer
        // TODO: Send emit to all driver and customer
        .then(updatedTrip => res.json(getPlain(updatedTrip)))
        .catch(next)
});

module.exports = router;