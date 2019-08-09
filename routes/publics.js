const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const PublicController = require('../controllers/PublicController')

router.get('/members', PublicController.members);
router.get('/events', PublicController.events);

module.exports = router;