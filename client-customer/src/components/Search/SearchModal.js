import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchModal.css";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a search term");
      return;
    }
    // Chuyển hướng đến trang kết quả tìm kiếm
    navigate(`/search-results?query=${query}`);
    onClose(); // Đóng modal
  };

  return (
    isOpen && (
      <div className="search-modal">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <h2>Search</h2>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    )
  );
};

export default SearchModal;
