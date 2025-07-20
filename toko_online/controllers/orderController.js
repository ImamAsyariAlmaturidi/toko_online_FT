const { Order, Product } = require("../models/index");
const axios = require("axios");
class OrderController {
  static async createOrder(req, res) {
    try {
      const { cart_items, customer_name, phone, address } = req.body;

      if (!cart_items || !customer_name || !phone || !address) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // 1. Ambil semua product_id
      const productIds = cart_items.map((item) => item.product_id);

      // 2. Ambil data produk dari database
      const products = await Product.findAll({
        where: { id: productIds },
      });

      // 3. Hitung total_price dari produk * quantity
      let total_price = 0;

      const cartDetails = cart_items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product)
          throw new Error(`Product ID ${item.product_id} not found`);

        const subtotal = product.price * item.quantity;
        total_price += subtotal;

        // Optional: masukkan detail produk (nama, dll) untuk referensi
        return {
          ...item,
          name: product.name,
          price: product.price,
          subtotal,
        };
      });

      // MIDTRANS payment setup
      const serverKey = process.env.MIDTRAN_API_KEY;
      const authString = Buffer.from(serverKey + ":").toString("base64");

      const orderId = `order-${Date.now()}`;

      const response = await axios.post(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        {
          transaction_details: {
            order_id: orderId,
            gross_amount: total_price,
          },
        },
        {
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await Order.create({
        cart_items: cartDetails,
        total_price,
        customer_name,
        phone,
        address,
        payment_status: "pending",
        midtrans_order_id: orderId,
      });
      console.log("Order created:", data);

      res.status(201).json(response.data);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getOrders(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: orders } = await Order.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      if (!orders.length) {
        return res.status(404).json({ error: "No orders found" });
      }

      res.status(200).json({
        totalOrders: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        orders,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = OrderController;
