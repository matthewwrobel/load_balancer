const express = require('express');
const app = express();
const port = 1000;
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const servers = (process.env.SERVERS).split(' ');
const server1 = createProxyMiddleware({ target: `http://${servers[0]}:8000`, changeOrigin: true});
const server2 = createProxyMiddleware({ target: `http://${servers[1]}:8000`, changeOrigin: true});
const server3 = createProxyMiddleware({ target: `http://${servers[2]}:8000`, changeOrigin: true});
const server4 = createProxyMiddleware({ target: `http://${servers[3]}:8000`, changeOrigin: true});

let index = 0;

app.use('/', (req, res, next) => {
  index ===  servers.length - 1 ? index = 0 : index++;
  next();
});

app.use('/', (req, res, next) => {

  if (index === 0) {
    console.log(index);
    server1(req, res, next);
  }
  if (index === 1) {
    console.log(index);
    server2(req, res, next);
  }
  if (index === 2) {
    console.log(index);
    server3(req, res, next);
  }
  if (index === 3) {
    console.log(index);
    server4(req, res, next);
  }

});

app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`)
});