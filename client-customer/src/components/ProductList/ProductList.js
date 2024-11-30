import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Để điều hướng đến trang chi tiết
import API from "../../api/api";
import "./ProductList.css"; // Import file CSS

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("user/products"); // Gọi API lấy danh sách sản phẩm
      setProducts(response.data); // Cập nhật danh sách sản phẩm
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading danh sách sản phẩm...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Danh sách sản phẩm</h1>
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
            <p className="product-price">{product.price} USD</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
