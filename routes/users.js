const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../configs/passport.js');
const config = require('../configs/config.js');
const {upload} = require('../configs/multer.js')

const UserController = require('../controllers/UserController')
const UserValidator = require('../validators/UserValidator')

router.post('/register', upload.single('image'), UserValidator.register, UserController.register);
router.get('/:userId', UserController.show);
router.get('/', UserController.index);
router.patch('/:userId', upload.single('image'), UserValidator.update, UserController.update);
router.delete('/:userId', UserController.delete);
// router.post('/login', passport.authenticate('local', { session:false }), UserController.login);
// router.post('/secret', passport.authenticate('jwt', { session:false }), UserController.secret);


module.exports = router;