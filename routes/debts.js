const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const DebtController = require('../controllers/DebtController')
const DebtValidator = require('../validators/DebtValidator')

router.post('/create', DebtValidator.create, DebtController.create);
router.get('/:debtId', DebtController.show);
router.get('/', DebtController.index);
router.patch('/:debtId', DebtValidator.update, DebtController.update);
router.delete('/:debtId', DebtController.delete);

module.exports = router;