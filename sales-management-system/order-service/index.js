const express = require("express");
const app = express();
app.use(express.json());

let orders = [
  { id: 1, customerId: 1, productId: 1, quantity: 2, status: "pending" },
];

app.get("/orders", (req, res) => res.json(orders));

app.get("/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  order
    ? res.json(order)
    : res.status(404).json({ message: "Order not found" });
});

app.post("/orders", (req, res) => {
  const order = {
    id: orders.length + 1,
    customerId: req.body.customerId,
    productId: req.body.productId,
    quantity: req.body.quantity,
    status: "pending",
  };
  orders.push(order);
  res.status(201).json(order);
});

app.put("/orders/:id/cancel", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = "cancelled";
  res.json(order);
});

app.listen(3002, () => console.log("Order Service running on port 3002"));
