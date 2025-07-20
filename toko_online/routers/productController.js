const authorization = require("../middlewares/authorization");
const ProductController = require("../controllers/productController");
const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get("/products", ProductController.getProducts);
router.get("/products/:id", ProductController.getProductById);
router.post(
  "/products",
  authorization,
  upload.single("image"),
  ProductController.createProduct
);
router.put(
  "/products/:id",
  authorization,
  upload.single("image"),
  ProductController.updateProduct
);
router.delete("/products/:id", authorization, ProductController.deleteProduct);

module.exports = router;
