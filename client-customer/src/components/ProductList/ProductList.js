import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("user/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    }
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Danh sách sản phẩm</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={
                product.images && product.images[0]
                  ? product.images[0]
                  : "/no-image.png"
              }
              alt={product.name}
              className="product-image"
            />
            <div className="product-card-content">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price.toLocaleString()}₫</p>
              {product.oldPrice && (
                <p className="product-old-price">
                  {product.oldPrice.toLocaleString()}₫
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
