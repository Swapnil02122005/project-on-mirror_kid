const express = require('express');
const router = express.Router();
const { register, login, pair } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/pair', pair);

module.exports = router;