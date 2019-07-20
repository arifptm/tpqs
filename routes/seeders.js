const express = require('express');
const router = express.Router();
const config = require('../configs/config.js');

const Seeder = require('../seeders/seeder')

router.get('/member', Seeder.member);

module.exports = router;