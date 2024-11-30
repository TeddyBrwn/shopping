import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/wishlist'; // URL API của Wishlist

// Hàm để thêm sản phẩm vào wishlist
export const addToWishlist = async (wishlistItem) => {
  try {
    const response = await axios.post(BASE_URL, wishlistItem);
    return response.data;
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    throw error;
  }
};

// Hàm để lấy tất cả sản phẩm trong wishlist
export const getWishlist = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    throw error;
  }
};

// Hàm để xóa sản phẩm khỏi wishlist
export const clearWishlistById = async (itemId) => {
  try {
    await axios.delete(`${BASE_URL}/${itemId}`);
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    throw error;
  }
};

// Hàm để xóa toàn bộ wishlist (nếu cần)
export const clearAllWishlist = async () => {
  try {
    await axios.delete(BASE_URL);
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

// Hàm để tạo mới wishlist (thường là khi chưa có wishlist cho người dùng)
export const createWishlist = async (wishlistData) => {
  try {
    const response = await axios.post(BASE_URL, wishlistData);
    return response.data;
  } catch (error) {
    console.error('Error creating wishlist:', error);
    throw error;
  }
};
