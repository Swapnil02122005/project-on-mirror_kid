const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Route placeholders
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/controls', require('./routes/controls'));
app.use('/api/consent', require('./routes/consent'));

// Serve static website
const staticDir = path.join(__dirname, '..', '..', 'web');
app.use(express.static(staticDir));

module.exports = app;