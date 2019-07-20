const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const EventController = require('../controllers/EventController')
const EventValidator = require('../validators/EventValidator')

router.post('/create', EventValidator.create, EventController.create);

// router.get('/:meetingId', EventController.show);
router.get('/', EventController.index);
// router.patch('/:meetingId', EventValidator.update, EventController.update);
// router.delete('/:meetingId', EventController.delete);

module.exports = router;