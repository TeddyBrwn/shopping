import React, { useEffect, useState } from 'react';
import { getAllCartItems, removeCartItem, updateCartItem } from '../../api/CartApi';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Gọi API lấy tất cả các sản phẩm trong giỏ hàng khi component được render
    getAllCartItems()
      .then(data => {
        setCartItems(data);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  }, []);

  // Hàm tính tổng tiền
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString() + '₫';
  };

  // Hàm cập nhật số lượng sản phẩm
  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) return;
    updateCartItem(itemId, { quantity })
      .then(() => {
        setCartItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, quantity } : item));
      })
      .catch(error => console.error('Error updating cart item:', error));
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (itemId) => {
    removeCartItem(itemId)
      .then(() => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      })
      .catch(error => console.error('Error removing cart item:', error));
  };

  return (
    <div className="cart-page">
      <h2>Giỏ Hàng Của Bạn</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn hiện đang trống.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Giá: {item.price.toLocaleString()}₫</p>
                <div className="quantity-controls">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-item-button" onClick={() => handleRemoveItem(item.id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-summary">
        <h3>Tổng cộng: {getTotalPrice()}</h3>
        <button className="checkout-button" onClick={() => alert('Proceed to Checkout')}>
          Tiến Hành Thanh Toán
        </button>
      </div>
    </div>
  );
}

export default Cart;
