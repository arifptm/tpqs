const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const BalanceController = require('../controllers/BalanceController')

router.get('/', BalanceController.getBalance);

module.exports = router;