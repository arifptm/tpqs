const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const EventController = require('../controllers/EventController')
const EventValidator = require('../validators/EventValidator')


router.get('/date-list', EventController.dateList)
router.post('/create', EventValidator.create, EventController.create);

// router.get('/:eventId', EventController.show);
router.get('/', EventController.index);
router.patch('/:eventId', EventValidator.update, EventController.update);
router.delete('/:eventId', EventController.delete);

module.exports = router;