const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');
const {upload} = require('../configs/multer.js')

const MemberController = require('../controllers/MemberController')
const MemberValidator = require('../validators/MemberValidator')

router.get('/name-list', MemberController.nameList);

router.post('/create', upload.single('image'), MemberValidator.create, MemberController.create);
router.get('/:memberId', MemberController.show);
router.get('/', MemberController.index);
router.patch('/:memberId', upload.single('image'), MemberValidator.update, MemberController.update);
router.delete('/:memberId', MemberController.delete);

router.get('/:memberId/savings', MemberController.memberSavings);



module.exports = router;