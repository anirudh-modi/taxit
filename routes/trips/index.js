const router = require('express').Router();
const validator = require('validator');
const db = require('../../models');
const { getPlain, validationError } = require('../../util/helper');
const tripIdRouter = require('./id');
const socketHandler = require('../../util/socketHandler');

router.get('/:tripStatus(ALL|WAITING|ONGOING|COMPLETED)', function (req, res, next) {
    const { tripStatus } = req.params;
    const { customerId, driverId } = req.query;
    const whereClause = {}

    if (tripStatus !== 'ALL') {
        whereClause.status = tripStatus;
    }

    if (customerId) {
        whereClause.customer_id = parseInt(customerId);
    }

    if (driverId) {
        whereClause[db.Sequelize.Op.or] = [
            {
                driver_id: parseInt(driverId)
            },
            {
                status: "WAITING"
            }
        ]
    }

    return db
        .Trips
        .findAll({
            where: whereClause,
            order: [['created_at', 'DESC'], ['id', 'ASC']]
        })
        .then(
            trips => res.json(trips
                .map(trip => getPlain(trip))
            )
        )
        .catch(next);
});

router.post('/', function (req, res, next) {
    const { customerId, socketId } = req.query;

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
        .then(trip => {
            socketHandler.sendEmit('Trip Added', socketId);
            return res.json(getPlain(trip));
        })
        .catch(next);
});

router.use('/:tripId', tripIdRouter);

module.exports = router;