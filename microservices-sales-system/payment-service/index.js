const express = require("express");
const CircuitBreaker = require("opossum");
const redis = require("redis");
const app = express();

app.use(express.json());

// Kết nối Redis
const redisClient = redis.createClient({ url: "redis://redis:6379" });
redisClient.connect().catch(console.error);

// Danh sách giao dịch (giả lập)
let transactions = [];

// Circuit Breaker cho xử lý thanh toán
const breakerOptions = {
  timeout: 1000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};
const processPaymentBreaker = new CircuitBreaker(async (paymentData) => {
  const { orderId, amount } = paymentData;
  // Giả lập lỗi ngẫu nhiên
  if (Math.random() < 0.2) throw new Error("Payment processing failed");
  const transaction = {
    id: transactions.length + 1,
    orderId,
    amount,
    status: "completed",
  };
  transactions.push(transaction);
  await redisClient.set(
    `transaction:${transaction.id}`,
    JSON.stringify(transaction)
  );
  return transaction;
}, breakerOptions);

// Xử lý thanh toán
app.post("/payment/process", async (req, res) => {
  const { orderId, amount } = req.body;
  let retries = 3;
  while (retries > 0) {
    try {
      const transaction = await processPaymentBreaker.fire({ orderId, amount });
      return res.json({ message: "Payment processed", transaction });
    } catch (error) {
      retries--;
      if (retries === 0) {
        return res
          .status(500)
          .json({ message: "Payment failed after retries" });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Chờ trước khi thử lại
    }
  }
});

app.listen(3001, () => {
  console.log("Payment Service running on port 3001");
});
