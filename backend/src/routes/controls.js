const express = require('express');
const router = express.Router();

router.post('/restrict-app', (req, res) => res.send('Restrict app'));
router.post('/screen-time', (req, res) => res.send('Set screen time'));
router.post('/block-app', (req, res) => res.send('Block app'));

module.exports = router;