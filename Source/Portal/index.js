const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.static('.'));
app.use('/orders', createProxyMiddleware({ target: 'http://localhost:8001', pathRewrite: { '^/orders/': '/' } }));

app.listen(8000, () => console.log('Portal listening on 8000'));