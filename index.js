const debug = require('debug')('app:server');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./app/routers/index.js')

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => debug(`server ready on http://localhost:${PORT}`));
