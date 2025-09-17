const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => res.send('Consent status'));
router.post('/grant', (req, res) => res.send('Grant consent'));
router.post('/revoke', (req, res) => res.send('Revoke consent'));

module.exports = router;