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

        // Set giá trị mặc định cho kích thước và màu
        const sizeAttribute = data.attributes.find(
          (attr) => attr.key === "Kích thước"
        );
        const colorAttribute = data.attributes.find(
          (attr) => attr.key === "Màu"
        );

        setSelectedSize(sizeAttribute?.value || null);
        setSelectedColor(colorAttribute?.value || null);
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

  // Lấy danh sách màu sắc và kích thước từ attributes
  const sizes = product.attributes
    .filter((attr) => attr.key === "Kích thước")
    .map((attr) => attr.value);

  const colors = product.attributes
    .filter((attr) => attr.key === "Màu")
    .map((attr) => attr.value);

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
          <p className="product-detail-price">
            {product.price.toLocaleString()}₫
          </p>

          {/* Chọn kích thước */}
          <div className="product-sizes">
            <h3>Chọn kích cỡ:</h3>
            <ul>
              {sizes.length > 0 ? (
                sizes.map((size) => (
                  <li
                    key={size}
                    className={`size-option ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </li>
                ))
              ) : (
                <p>Không có kích cỡ</p>
              )}
            </ul>
          </div>

          {/* Chọn màu sắc */}
          <div className="product-colors">
            <h3>Chọn màu sắc:</h3>
            <ul>
              {colors.length > 0 ? (
                colors.map((color) => (
                  <li
                    key={color}
                    className={`color-option ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  ></li>
                ))
              ) : (
                <p>Không có màu sắc</p>
              )}
            </ul>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
        </div>
      </div>

      {/* Mô tả thêm */}
      <div className="product-detail-description">
        <h2>Mô tả sản phẩm</h2>
        <p>{product.description || "Không có mô tả."}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
