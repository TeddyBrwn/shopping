import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/cart';

// Hàm lấy tất cả sản phẩm trong giỏ hàng
export const getAllCartItems = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Hàm thêm sản phẩm vào giỏ hàng
export const addCartItem = async (cartItem) => {
  const response = await axios.post(BASE_URL, cartItem);
  return response.data;
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (itemId) => {
  await axios.delete(`${BASE_URL}/${itemId}`);
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (itemId, updateData) => {
  const response = await axios.put(`${BASE_URL}/${itemId}`, updateData);
  return response.data;
};
