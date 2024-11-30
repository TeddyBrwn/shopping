import React from "react";

const SortDropdown = ({ onSortChange }) => {
  return (
    <div className="sort-dropdown">
      <label htmlFor="sort">Sắp xếp theo:</label>
      <select
        id="sort"
        name="sort"
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="">Chọn...</option>
        <option value="latest">Mới nhất</option>
        <option value="bestseller">Bán chạy</option>
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
        <option value="az">Theo bảng chữ cái A-Z</option>
        <option value="za">Theo bảng chữ cái Z-A</option>
      </select>
    </div>
  );
};

export default SortDropdown;
