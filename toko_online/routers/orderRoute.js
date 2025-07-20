const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const authorization = require("../middlewares/authorization");
router.get("/orders", authorization, OrderController.getOrders);
router.post("/orders", OrderController.createOrder);
router.get("/orders/:id", authorization, OrderController.getOrderById);

module.exports = router;
