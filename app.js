const express = require('express');
const app = express();
const port = 1000;
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

let servers = (process.env.SERVERS).split(' ');

let index = 0;

app.use('/', (req, res, next) => {
  index === 3 ? index = 0 : index++;
  next();
});

app.use('/', createProxyMiddleware({ target: `http://${servers[index]}:8000`, changeOrigin: true}));

app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`)
})