const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
require("dotenv").config(); // Sử dụng dotenv để lấy BASE_URL từ file .env

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; // URL gốc

// Lấy danh sách sản phẩm theo bộ lọc và sắp xếp
const getFilteredProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "price",
      order = "asc",
      page = 1,
      limit = 10,
      color,
      size,
    } = req.query;

    // Tạo bộ lọc tìm kiếm
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" }; // Tìm kiếm theo tên (không phân biệt hoa/thường)
    if (category) filter.category = category; // Lọc theo danh mục
    if (minPrice) filter.price = { $gte: minPrice }; // Giá thấp nhất
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice }; // Giá cao nhất
    if (inStock) filter.inStock = inStock === "true"; // Lọc theo hàng tồn kho
    if (color) filter.color = color; // Lọc theo màu sắc
    if (size) filter.size = size; // Lọc theo kích thước

    // Xác định sắp xếp
    let sortOptions = {};
    switch (sortBy) {
      case "latest":
        sortOptions = { createdAt: -1 }; // Mới nhất
        break;
      case "bestseller":
        sortOptions = { sold: -1 }; // Bán chạy
        break;
      case "price_asc":
        sortOptions = { price: 1 }; // Giá tăng dần
        break;
      case "price_desc":
        sortOptions = { price: -1 }; // Giá giảm dần
        break;
      case "az":
        sortOptions = { name: 1 }; // Từ A-Z
        break;
      case "za":
        sortOptions = { name: -1 }; // Từ Z-A
        break;
      default:
        sortOptions = {}; // Không sắp xếp
    }

    // Lấy danh sách sản phẩm từ cơ sở dữ liệu
    const products = await Product.find(filter)
      .populate("category", "name") // Lấy tên danh mục
      .sort(sortOptions) // Sắp xếp sản phẩm
      .skip((page - 1) * limit) // Phân trang
      .limit(Number(limit));

    // Xử lý dữ liệu sản phẩm, thêm URL đầy đủ cho hình ảnh
    const updatedProducts = products.map((product) => ({
      ...product._doc,
      images: product.images.map((image) => `${BASE_URL}/${image}`), // Thêm URL gốc cho hình ảnh
    }));

    // Trả về danh sách sản phẩm
    res.status(200).json({ products: updatedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Tìm sản phẩm theo ID
    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Thêm URL đầy đủ cho hình ảnh
    const updatedProduct = {
      ...product._doc,
      images: product.images.map((image) => `${BASE_URL}/${image}`),
    };

    // Trả về sản phẩm
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product by ID", error });
  }
};

module.exports = {
  getFilteredProducts,
  getProductById,
};
