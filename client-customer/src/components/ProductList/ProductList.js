import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Để điều hướng đến trang chi tiết
import API from "../../api/api"; // Import API
import "./ProductList.css"; // Import file CSS

function ProductList() {
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State lưu trạng thái tải dữ liệu
  const [error, setError] = useState(""); // State lưu thông báo lỗi
  const [sortOption, setSortOption] = useState(""); // State lưu lựa chọn sắp xếp

  // Gọi API khi trang được tải hoặc khi thay đổi tùy chọn sắp xếp
  useEffect(() => {
    fetchProducts(sortOption);
  }, [sortOption]);

  // Hàm gọi API để lấy danh sách sản phẩm
  const fetchProducts = async (sort) => {
    setLoading(true);
    setError(""); // Reset lỗi trước khi gọi API
    try {
      const response = await API.get(`user/products?sort=${sort || ""}`); // Gửi yêu cầu API kèm tham số sắp xếp
      setProducts(response.data); // Cập nhật state với danh sách sản phẩm
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau."); // Cập nhật lỗi
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // Hàm xử lý khi người dùng thay đổi tùy chọn sắp xếp
  const handleSortChange = (e) => {
    setSortOption(e.target.value); // Cập nhật tùy chọn sắp xếp
  };

  if (loading) return <div>Loading danh sách sản phẩm...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Danh sách sản phẩm</h1>

      {/* Dropdown Menu để sắp xếp sản phẩm */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sắp xếp theo:</label>
        <select id="sort" onChange={handleSortChange} value={sortOption}>
          <option value="">Chọn...</option>
          <option value="latest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="product-grid">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`} // Đường dẫn đến trang chi tiết sản phẩm
            className="product-card"
          >
            <img
              src={
                product.images && product.images[0]
                  ? product.images[0]
                  : "/no-image.png"
              }
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">
              {product.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
