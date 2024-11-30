import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/user/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Có lỗi xảy ra khi tải thông tin sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading sản phẩm...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Hình ảnh */}
        <div className="product-image-section">
          <img
            src={
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : "/no-image.png"
            }
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        {/* Thông tin */}
        <div className="product-info-section">
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-price">{product.price}₫</p>

          {/* Chọn kích cỡ */}
          <div className="product-sizes">
            <h3>Chọn kích cỡ:</h3>
            <ul>
              {product.sizes?.map((size) => (
                <li
                  key={size}
                  className={`size-option ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </li>
              ))}
            </ul>
          </div>

          {/* Chọn màu sắc */}
          <div className="product-colors">
            <h3>Chọn màu sắc:</h3>
            <ul>
              {product.colors?.map((color) => (
                <li
                  key={color}
                  className={`color-option ${
                    selectedColor === color ? "active" : ""
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setSelectedColor(color)}
                ></li>
              ))}
            </ul>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
        </div>
      </div>

      {/* Mô tả thêm */}
      <div className="product-detail-description">
        <h2>Mô tả sản phẩm</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
