const express = require("express");
const httpProxy = require("http-proxy-middleware");
const app = express();

const productService = "http://localhost:3001";
const orderService = "http://localhost:3002";
const customerService = "http://localhost:3003";

app.use(
  "/products",
  httpProxy.createProxyMiddleware({
    target: productService,
    changeOrigin: true,
  })
);
app.use(
  "/orders",
  httpProxy.createProxyMiddleware({ target: orderService, changeOrigin: true })
);
app.use(
  "/customers",
  httpProxy.createProxyMiddleware({
    target: customerService,
    changeOrigin: true,
  })
);

app.listen(3000, () => console.log("API Gateway running on port 3000"));
