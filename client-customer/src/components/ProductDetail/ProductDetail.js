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

        const sizeAttribute = data.attributes.find((attr) => attr.key === "Kích thước");
        const colorAttribute = data.attributes.find((attr) => attr.key === "Màu");

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

  const handleAddToCart = async () => {
    try {
      const payload = {
        productId: id,
        quantity: 1,
      };
      await API.post("/cart", payload);
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const payload = {
        productId: id,
      };
      await API.post("/wishlist", payload);
      alert("Sản phẩm đã được thêm vào mục yêu thích!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("Có lỗi xảy ra khi thêm vào mục yêu thích!");
    }
  };

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
              {product.attributes
                .filter((attr) => attr.key === "Kích thước")
                .map((attr) => (
                  <li
                    key={attr.value}
                    className={`size-option ${
                      selectedSize === attr.value ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(attr.value)}
                  >
                    {attr.value}
                  </li>
                ))}
            </ul>
          </div>

          {/* Chọn màu sắc */}
          <div className="product-colors">
            <h3>Chọn màu sắc:</h3>
            <ul>
              {product.attributes
                .filter((attr) => attr.key === "Màu")
                .map((attr) => (
                  <li
                    key={attr.value}
                    className={`color-option ${
                      selectedColor === attr.value ? "active" : ""
                    }`}
                    style={{ backgroundColor: attr.value }}
                    onClick={() => setSelectedColor(attr.value)}
                  ></li>
                ))}
            </ul>
          </div>

          {/* Nút thêm vào giỏ hàng và yêu thích */}
          <div className="product-actions">
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Thêm vào giỏ hàng
            </button>
            <button onClick={handleAddToWishlist} className="add-to-wishlist-btn">
              Thêm vào mục yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả thêm */}
      <div className="product-detail-description">
        <h2>Mô tả sản phẩm</h2>
        <p>{product.description || "- 2-WAY 100% COTTON - BOXY - CREWNECK- ARTWORK PRINTED AT FRONT- MADE IN VIET NAM"}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
