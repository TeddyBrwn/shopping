// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/Homepage/Homepage";
import ProductList from "./components/ProductList/ProductList";
import CartPage from "./components/Cart/Cart";
import LoginPage from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import WishlistPage from "./components/Wishlist/Wishlist";
import RequestPasswordReset from "./components/RequestPasswordReset/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Verify from "./components/Verify/Verify";
import SearchResults from "./components/SearchResults/SearchResults"; // Import đúng tên SearchResults
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Header */}
          <Header />

          {/* Nội dung chính của ứng dụng */}
          <main className="main-content">
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<HomePage />} />
              {/* Trang sản phẩm theo danh mục */}
              <Route
                path="/products/all"
                element={<ProductList category="all" />}
              />
              <Route
                path="/products/men"
                element={<ProductList category="men" />}
              />
              <Route
                path="/products/women"
                element={<ProductList category="women" />}
              />
              <Route
                path="/products/outwear"
                element={<ProductList category="outwear" />}
              />
              <Route
                path="/products/accessories"
                element={<ProductList category="accessories" />}
              />
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* Chi tiết sản phẩm */}
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* Trang giỏ hàng */}
              <Route path="/cart" element={<CartPage />} />
              {/* Danh sách yêu thích */}
              <Route path="/wishlist" element={<WishlistPage />} />
              {/* Đăng nhập */}
              <Route path="/login" element={<LoginPage />} />
              {/* Đăng ký */}
              <Route path="/register" element={<Register />} />
              {/* Khôi phục mật khẩu */}
              <Route
                path="/request-password-reset"
                element={<RequestPasswordReset />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              {/* Xác minh tài khoản */}
              <Route path="/verify" element={<Verify />} />
              {/* Trang kết quả tìm kiếm */}
              <Route path="/search" element={<SearchResults />} />{" "}
              {/* Cập nhật thành SearchResults */}
              {/* Trang không tìm thấy - điều hướng về trang chủ */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
