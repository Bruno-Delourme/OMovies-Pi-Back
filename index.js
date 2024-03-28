const debug = require("debug")("api:initialization");

require("dotenv").config();
const router = require("./app/router");

const express = require("express");

const app = express();

app.use(router);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT,() => {
  debug(`API launch on http://localhost:${PORT}`);
});