const { Product } = require("../models/index");
const { uploadImage } = require("../utils/imageKit");
class ProductController {
  static async getProducts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const rows = await Product.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      const count = await Product.count();

      const products = { rows, count };

      res.status(200).json({
        totalItems: products.count,
        totalPages: Math.ceil(products.count / limit),
        currentPage: parseInt(page),
        data: products.rows,
      });
    } catch (error) {
      console.log("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async createProduct(req, res) {
    try {
      console.log("Creating product with data:", req.body);
      const { name, price, description, stock } = req.body;
      if (!name || !price || !description) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const image = req.file;

      const upload = await uploadImage(image.buffer, image.originalname, {
        folder: "products",
      });

      const newProduct = await Product.create({
        name,
        price,
        description,
        stock,
        image_url: upload.url,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.log("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const { name, price, description, stock } = req.body;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.stock = stock || product.stock;
      product.image_url = req.file
        ? (
            await uploadImage(req.file.buffer, req.file.originalname, {
              folder: "products",
            })
          ).url
        : product.image_url;
      await product.save();

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = ProductController;
