const express = require('express');
const app = express();
const port = 1000;
require('dotenv').config();

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/', createProxyMiddleware({ target: 'http://18.218.110.105:8000', changeOrigin: true}));

// console.log(process.env.SERVERS);
// let servers = (process.env.SERVERS).split(' ');
// console.log(servers);



// app.get('/', (req, res) => {
//   res.send('Hello World');
// });



app.listen(port, () => {
  console.log(`Load balancer running at http://localhost:${port}`)
})