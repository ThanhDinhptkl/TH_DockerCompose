const express = require("express");
const app = express();

app.use(express.json());

let transactions = [];

// Xác nhận thanh toán
app.post("/payment/process", (req, res) => {
  const { orderId, amount } = req.body;
  const transaction = {
    id: transactions.length + 1,
    orderId,
    amount,
    status: "completed",
  };
  transactions.push(transaction);
  res.json({ message: "Payment processed", transaction });
});

// Hoàn tiền
app.post("/payment/refund", (req, res) => {
  const { transactionId } = req.body;
  const transaction = transactions.find((t) => t.id === transactionId);
  if (transaction) {
    transaction.status = "refunded";
    res.json({ message: "Refund processed", transaction });
  } else {
    res.status(404).json({ message: "Transaction not found" });
  }
});

app.listen(3001, () => {
  console.log("Payment Service running on port 3001");
});
