const express = require('express');
const app = express();
const port = 1000;
require('dotenv').config();
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const servers = (process.env.SERVERS).split(' ');
const redis = require("redis");
const redisPort = 6379
const redisClient = redis.createClient(redisPort);
const { promisify } = require("util");
const setAsync = promisify(redisClient.set).bind(redisClient);

redisClient.on("error", (err) => {
  console.log(err);
});

const proxyServers = servers.map((e, i) => createProxyMiddleware({
  target: `http://${servers[i]}:8000`,
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8');
    try {
      await setAsync(JSON.stringify(req.query), response);
    } catch (err) {
      console.log(err);
    }
    return responseBuffer;
  })
}));

let index = 0;

app.use('/', (req, res, next) => {
  const query = JSON.stringify(req.query);
  try {
    redisClient.get(query, (err, results) => {
      if (err) {
        throw err;
      }
      if (results) {
        console.log('result was found in redis cache!');
        res.status(200).send(JSON.parse(results));
      } else {
        index === servers.length - 1 ? index = 0 : index++;
        proxyServers[index](req, res);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`)
});