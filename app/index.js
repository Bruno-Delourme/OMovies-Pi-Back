const path = require('node:path');
const express = require('express');
const cors = require('cors');

const router = require('./routers/api/index.js');

const app = express();

app.use(cors(process.env.CORS_DOMAINS ?? '*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

module.exports = app;
