const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    // Chuyển đường dẫn ảnh thành URL đầy đủ
    const updatedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map(
        (image) => `${req.protocol}://${req.get("host")}/${image}`
      ),
    }));

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Failed to retrieve products", error });
  }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Chuyển đường dẫn ảnh thành URL đầy đủ
    product.images = product.images.map(
      (image) => `${req.protocol}://${req.get("host")}/${image}`
    );

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Failed to retrieve product", error });
  }
};

// Tạo sản phẩm mới
exports.createProduct = [
  upload.single("image"), // Middleware xử lý upload file
  async (req, res) => {
    try {
      const { name, price, stock, category, description, attributes } =
        req.body;

      // Tạo sản phẩm mới
      const newProduct = new Product({
        name,
        price,
        stock,
        category,
        description,
        attributes: Array.isArray(attributes)
          ? attributes
          : JSON.parse(attributes), // Kiểm tra và parse attributes
        images: req.file ? [req.file.path] : [], // Thêm ảnh vào mảng
      });

      // Lưu sản phẩm
      await newProduct.save();

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product", error });
    }
  },
];

// Cập nhật sản phẩm
exports.updateProduct = [
  upload.single("image"), // Middleware xử lý upload file
  async (req, res) => {
    try {
      const { name, price, stock, category, description, attributes } =
        req.body;

      // Kiểm tra xem sản phẩm có tồn tại không
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Cập nhật các trường dữ liệu
      product.name = name || product.name;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.category = category || product.category; // category là ObjectId
      product.description = description || product.description;

      // Cập nhật attributes
      product.attributes = attributes
        ? Array.isArray(attributes)
          ? attributes
          : typeof attributes === "string"
          ? JSON.parse(attributes)
          : product.attributes
        : product.attributes;

      // Xử lý thêm ảnh nếu có
      if (req.file) {
        product.images.push(req.file.path); // Thêm ảnh mới vào mảng images
      }

      // Nếu cần xóa ảnh cũ, nhận danh sách ảnh cần giữ từ body
      if (req.body.imagesToKeep) {
        const imagesToKeep = JSON.parse(req.body.imagesToKeep);
        product.images = product.images.filter((image) =>
          imagesToKeep.includes(image)
        );
      }

      // Lưu thay đổi
      await product.save();

      // Phản hồi thành công
      res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product", error });
    }
  },
];

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Xóa các file ảnh trong thư mục uploads
    product.images.forEach((image) => {
      const filePath = path.join(__dirname, "../", image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

// Xóa nhiều sản phẩm
exports.deleteMultipleProducts = async (req, res) => {
  const { ids } = req.body; // Danh sách ID sản phẩm cần xóa
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "IDs must be an array" });
  }
  try {
    const products = await Product.find({ _id: { $in: ids } });

    // Xóa các file ảnh liên quan
    products.forEach((product) => {
      product.images.forEach((image) => {
        const filePath = path.join(__dirname, "../", image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    });

    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    res.status(500).json({ message: "Failed to delete products", error });
  }
};
