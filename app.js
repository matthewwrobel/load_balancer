const express = require('express');
const app = express();
const port = 1000;
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const servers = (process.env.SERVERS).split(' ');
const proxyServers = servers.map((e, i) => createProxyMiddleware({target: `http://${servers[i]}:8000`, changeOrigin: true}));

let index = 0;

app.use('/', (req, res, next) => {
  if (index === servers.length - 1) {
    index = 0;
  } else {
    index++;
  }
  proxyServers[index](req, res, next);
});

app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`)
});