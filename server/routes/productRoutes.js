// const express = require("express");
// const {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   deleteMultipleProducts,
// } = require("../controllers/productController");
// const { authenticate } = require("../middleware/authMiddleware");

// const router = express.Router();
// router.use(authenticate);
// // Lấy danh sách sản phẩm
// router.get("/", getProducts);

// // Lấy chi tiết sản phẩm theo ID
// router.get("/:id", getProductById);

// // Tạo sản phẩm mới
// router.post("/", createProduct);

// // Cập nhật sản phẩm theo ID
// router.put("/:id", updateProduct);

// // Xóa sản phẩm theo ID
// router.delete("/:id", deleteProduct);

// // Xóa nhiều sản phẩm
// router.delete("/", deleteMultipleProducts);

// module.exports = router;
