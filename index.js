const debug = require("debug")("app:server");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./app/routers/index.js");
const { PORT } = require("./app/config/config.js");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server ready on http://localhost:${PORT}`);
  debug(`server ready on http://localhost:${PORT}`);
});
