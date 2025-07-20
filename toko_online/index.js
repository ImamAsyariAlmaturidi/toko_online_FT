const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
const cors = require("cors");
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productRouter = require("./routers/productController");
const authRouter = require("./routers/authRoute");
const orderRouter = require("./routers/orderRoute");
const { Order } = require("./models");
app.use("/api", productRouter);
app.use("/api/auth", authRouter);
app.use("/api", orderRouter);

app.post("/api/midtrans/webhook", async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;

    console.log("Webhook received:", req.body);
    if (transaction_status === "settlement") {
      // Update the order status to 'paid' in your database
      await Order.update(
        { payment_status: "paid", updatedAt: new Date() },
        { where: { midtrans_order_id: order_id } } // ✅ benar
      );
      console.log(`Order ID: ${order_id} has been marked as paid.`);
    }

    console.log(
      `Order ID: ${order_id}, Transaction payment_status: ${transaction_status}`
    );
    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
