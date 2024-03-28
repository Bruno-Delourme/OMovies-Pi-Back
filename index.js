require('dotenv').config();
const http = require('node:http');
const debug = require('debug')('app:server');
const app = require('./app');

const PORT = process.env.PORT ?? 3000;

const server = http.createServer(app);

server.listen(PORT, () => debug(`server ready on http://localhost:${PORT}`));
