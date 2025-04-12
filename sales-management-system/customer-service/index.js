const express = require("express");
const app = express();
app.use(express.json());

let customers = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main St",
    contact: "john@example.com",
  },
];

app.get("/customers", (req, res) => res.json(customers));

app.get("/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  customer
    ? res.json(customer)
    : res.status(404).json({ message: "Customer not found" });
});

app.post("/customers", (req, res) => {
  const customer = {
    id: customers.length + 1,
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
  };
  customers.push(customer);
  res.status(201).json(customer);
});

app.put("/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  customer.name = req.body.name || customer.name;
  customer.address = req.body.address || customer.address;
  customer.contact = req.body.contact || customer.contact;
  res.json(customer);
});

app.delete("/customers/:id", (req, res) => {
  const index = customers.findIndex((c) => c.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ message: "Customer not found" });
  customers.splice(index, 1);
  res.status(204).send();
});

app.listen(3003, () => console.log("Customer Service running on port 3003"));
