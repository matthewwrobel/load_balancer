const express = require('express');
const app = express();
const port = 1000;
require('dotenv').config();
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const servers = (process.env.SERVERS).split(' ');
const proxyServers = servers.map((e, i) => createProxyMiddleware({
  target: `http://${servers[i]}:8000`,
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8');
    console.log(response); // log response body
    return responseBuffer;
  })
}));

let index = 0;

app.use('/', (req, res) => {
  index === servers.length - 1 ? index = 0 : index++;
  proxyServers[index](req, res);

});

app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`)
});