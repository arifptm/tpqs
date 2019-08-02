const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const InoutController = require('../controllers/InoutController')
const InoutValidator = require('../validators/InoutValidator')

// router.post('/create', InoutValidator.create, InoutController.create);
// router.get('/:inoutId', InoutController.show);
router.get('/', InoutController.index);
// router.patch('/:inoutId', InoutValidator.update, InoutController.update);
// router.delete('/:inoutId', InoutController.delete);

module.exports = router;