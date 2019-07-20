const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const SavingController = require('../controllers/SavingController')
const SavingValidator = require('../validators/SavingValidator')

router.post('/create', SavingValidator.create, SavingController.create);
router.get('/:savingId', SavingController.show);
router.get('/', SavingController.index);
router.patch('/:savingId', SavingValidator.update, SavingController.update);
router.delete('/:savingId', SavingController.delete);

module.exports = router;