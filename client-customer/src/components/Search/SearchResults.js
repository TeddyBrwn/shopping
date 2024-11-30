import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
        setProducts(data.products || []);
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
    if (!productId) {
      console.error("Invalid product ID:", productId);
      return;
    }
    navigate(`/product/${productId}`);
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
              key={product.id || product._id}
              className="product-card"
              onClick={() => handleProductClick(product.id || product._id)}
            >
              <img
                src={product?.images && product.images[0]}
                alt={product?.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
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
