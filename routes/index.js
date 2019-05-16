const router = require('express').Router();

const trips = require('./trips');

router.use('/trips', trips);

module.exports = router;