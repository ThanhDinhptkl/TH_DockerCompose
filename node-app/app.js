const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Xin chào từ ứng dụng Node.js trong Docker!");
});

app.listen(port, () => {
  console.log(`Ứng dụng chạy tại http://localhost:${port}`);
});
