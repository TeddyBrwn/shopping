const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const { authenticate, checkRole } = require("./middleware/authMiddleware");
// const { checkRole } = require("./middleware/checkRole");
const limiter = require("./middleware/rateLimiter");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const orderRoutes = require("./routes/orderRoutes");
// const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(limiter);
app.use("/api/auth", authRoutes);
app.use("/api/admin", authenticate, adminRoutes);
// app.use("/api/admin", authenticate, checkRole("admin"), adminRoutes);
app.use("/api/user", authenticate, userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/products", productRoutes);

module.exports = app;
