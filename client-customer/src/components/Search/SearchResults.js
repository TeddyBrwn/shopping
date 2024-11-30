import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy từ khóa tìm kiếm từ URL
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/search?search=${query}`
        );
        const data = await response.json();
        setProducts(data.products || []); // Lưu danh sách sản phẩm
      } catch (error) {
        console.error("Error fetching search results:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Điều hướng đến trang chi tiết sản phẩm
  };

  return (
    <div className="search-results-container">
      <h2>Search Results for: "{query}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)} // Điều hướng khi nhấp vào sản phẩm
            >
              <img
                src={product?.images && product.images[0]}
                alt={product?.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150"; // Hình mặc định nếu không tải được
                }}
              />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
