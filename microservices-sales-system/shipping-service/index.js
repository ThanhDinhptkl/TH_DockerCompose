const express = require("express");
const CircuitBreaker = require("opossum");
const redis = require("redis");
const app = express();

app.use(express.json());

// Kết nối Redis
const redisClient = redis.createClient({ url: "redis://redis:6379" });
redisClient.connect().catch(console.error);

// Danh sách đơn hàng giao hàng (giả lập)
let shipments = [];

// Circuit Breaker cho tạo đơn hàng giao hàng
const breakerOptions = {
  timeout: 1000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};
const createShipmentBreaker = new CircuitBreaker(async (shipmentData) => {
  const { orderId, address } = shipmentData;
  // Giả lập lỗi ngẫu nhiên
  if (Math.random() < 0.2) throw new Error("Shipment creation failed");
  const shipment = {
    id: shipments.length + 1,
    orderId,
    address,
    status: "pending",
  };
  shipments.push(shipment);
  await redisClient.set(`shipment:${shipment.id}`, JSON.stringify(shipment));
  return shipment;
}, breakerOptions);

// Tạo đơn hàng giao hàng
app.post("/shipping/create", async (req, res) => {
  const { orderId, address } = req.body;
  let retries = 3;
  while (retries > 0) {
    try {
      const shipment = await createShipmentBreaker.fire({ orderId, address });
      return res.json({ message: "Shipment created", shipment });
    } catch (error) {
      retries--;
      if (retries === 0) {
        return res
          .status(500)
          .json({ message: "Shipment creation failed after retries" });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Chờ trước khi thử lại
    }
  }
});

// Cập nhật trạng thái giao hàng
app.put("/shipping/update/:shipmentId", async (req, res) => {
  const { status } = req.body;
  const shipment = shipments.find(
    (s) => s.id === parseInt(req.params.shipmentId)
  );
  if (shipment) {
    shipment.status = status;
    await redisClient.set(`shipment:${shipment.id}`, JSON.stringify(shipment));
    res.json({ message: "Shipment updated", shipment });
  } else {
    res.status(404).json({ message: "Shipment not found" });
  }
});

app.listen(3003, () => {
  console.log("Shipping Service running on port 3003");
});
