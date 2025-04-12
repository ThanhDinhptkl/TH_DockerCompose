const express = require("express");
const app = express();
app.use(express.json());

let products = [
  {
    id: 1,
    name: "Laptop",
    price: 1000,
    description: "High-end laptop",
    stock: 50,
  },
  { id: 2, name: "Phone", price: 500, description: "Smartphone", stock: 100 },
];

app.get("/products", (req, res) => res.json(products));

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  product
    ? res.json(product)
    : res.status(404).json({ message: "Product not found" });
});

app.post("/products", (req, res) => {
  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    stock: req.body.stock,
  };
  products.push(product);
  res.status(201).json(product);
});

app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.description = req.body.description || product.description;
  product.stock = req.body.stock || product.stock;
  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ message: "Product not found" });
  products.splice(index, 1);
  res.status(204).send();
});

app.listen(3001, () => console.log("Product Service running on port 3001"));
