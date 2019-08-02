const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const InstallmentController = require('../controllers/InstallmentController')
const InstallmentValidator = require('../validators/InstallmentValidator')

// router.get('/auto-create', InstallmentController.autoCreate);

router.post('/create', InstallmentValidator.create, InstallmentController.create);
// router.get('/:installmentId', InstallmentController.show);
router.get('/', InstallmentController.index);
router.patch('/:installmentId',  InstallmentController.update);
router.delete('/:installmentId', InstallmentController.delete);

module.exports = router;