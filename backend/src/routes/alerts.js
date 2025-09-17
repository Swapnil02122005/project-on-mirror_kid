const express = require('express');
const router = express.Router();

router.post('/geofence', (req, res) => res.send('Geofence alert'));
router.post('/suspicious', (req, res) => res.send('Suspicious activity alert'));

module.exports = router;