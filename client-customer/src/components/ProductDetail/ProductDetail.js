import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/api';
import './ProductDetail.css';
import { addCartItem } from '../../api/CartApi'; // Import hàm thêm vào giỏ hàng
import { addToWishlist } from '../../api/wishlistApi'; // Import hàm thêm vào wishlist (đảm bảo tên và đường dẫn chính xác)

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/user/products/${id}`);
        setProduct(data);

        const sizeAttribute = data.attributes.find((attr) => attr.key === 'Kích thước');
        const colorAttribute = data.attributes.find((attr) => attr.key === 'Màu');

        setSelectedSize(sizeAttribute?.value || null);
        setSelectedColor(colorAttribute?.value || null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Có lỗi xảy ra khi tải thông tin sản phẩm!');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading sản phẩm...</div>;
  if (error) return <div>{error}</div>;

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    const cartItem = {
      productId: product._id,
      quantity: 1,
    };

    try {
      await addCartItem(cartItem);
      alert('Sản phẩm đã được thêm vào giỏ hàng thành công!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  // Hàm thêm sản phẩm vào wishlist
  const handleAddToWishlist = async () => {
    const wishlistItem = {
      productId: product._id,
    };

    try {
      await addToWishlist(wishlistItem);
      alert('Sản phẩm đã được thêm vào mục yêu thích!');
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào wishlist.');
    }
  };

  return (
    <div className="product-detail-container">
      <div className="product-image-container">
        <img
          src={
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : '/no-image.png'
          }
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">{product.price.toLocaleString()}₫</p>

        <div className="product-sizes">
          <h3>Chọn kích cỡ:</h3>
          <ul>
            {product.attributes
              .filter((attr) => attr.key === 'Kích thước')
              .map((attr) => (
                <li
                  key={attr.value}
                  className={`size-option ${selectedSize === attr.value ? 'active' : ''}`}
                  onClick={() => setSelectedSize(attr.value)}
                >
                  {attr.value}
                </li>
              ))}
          </ul>
        </div>

        <div className="product-colors">
          <h3>Chọn màu sắc:</h3>
          <ul>
            {product.attributes
              .filter((attr) => attr.key === 'Màu')
              .map((attr) => (
                <li
                  key={attr.value}
                  className={`color-option ${selectedColor === attr.value ? 'active' : ''}`}
                  style={{ backgroundColor: attr.value }}
                  onClick={() => setSelectedColor(attr.value)}
                ></li>
              ))}
          </ul>
        </div>

        <div className="product-actions">
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
          <button className="add-to-wishlist-button" onClick={handleAddToWishlist}>
            Thêm vào mục yêu thích
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
