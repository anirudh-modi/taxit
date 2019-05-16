const router = require('express').Router();
const validator = require('validator');
const db = require('../../models');
const { getPlain, validationError } = require('../../util/helper');
const tripIdRouter = require('./id');

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
});

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

router.use('/:tripId', tripIdRouter);

module.exports = router;