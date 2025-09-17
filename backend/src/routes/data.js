const express = require('express');
const router = express.Router();

// TODO: Import controllers

router.post('/sms', (req, res) => res.send('SMS sync'));
router.post('/call-logs', (req, res) => res.send('Call logs sync'));
router.post('/apps', (req, res) => res.send('Apps sync'));
router.post('/screen-time', (req, res) => res.send('Screen time sync'));
router.post('/location', (req, res) => res.send('Location sync'));
router.get('/:childId', (req, res) => res.send('Get child data'));

module.exports = router;