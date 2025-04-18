const express = require("express");
const app = express();

app.use(express.json());

let shipments = [];

// Tạo đơn hàng giao hàng
app.post("/shipping/create", (req, res) => {
  const { orderId, address } = req.body;
  const shipment = {
    id: shipments.length + 1,
    orderId,
    address,
    status: "pending",
  };
  shipments.push(shipment);
  res.json({ message: "Shipment created", shipment });
});

// Cập nhật trạng thái giao hàng
app.put("/shipping/update/:shipmentId", (req, res) => {
  const { status } = req.body;
  const shipment = shipments.find(
    (s) => s.id === parseInt(req.params.shipmentId)
  );
  if (shipment) {
    shipment.status = status;
    res.json({ message: "Shipment updated", shipment });
  } else {
    res.status(404).json({ message: "Shipment not found" });
  }
});

app.listen(3003, () => {
  console.log("Shipping Service running on port 3003");
});
