const express = require("express");
const app = express();

app.use(express.json());

let inventory = [
  { productId: 1, name: "Product A", quantity: 100 },
  { productId: 2, name: "Product B", quantity: 50 },
];

// Kiểm tra và cập nhật tồn kho
app.post("/inventory/update", (req, res) => {
  const { productId, quantity } = req.body;
  const product = inventory.find((p) => p.productId === productId);
  if (product) {
    if (product.quantity >= quantity) {
      product.quantity -= quantity;
      res.json({ message: "Inventory updated", product });
    } else {
      res.status(400).json({ message: "Insufficient stock" });
    }
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Lấy thông tin tồn kho
app.get("/inventory/:productId", (req, res) => {
  const product = inventory.find(
    (p) => p.productId === parseInt(req.params.productId)
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.listen(3002, () => {
  console.log("Inventory Service running on port 3002");
});
