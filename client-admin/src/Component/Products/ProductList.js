import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../api/api";
import "./Products.css";
import ProductForm from "./ProductForm";

function ProductList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập trước!");
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/admin/products");
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/admin/login");
      }
    }
  };

  const getCategoryName = (product) => {
    if (!product.category || !product.category.name) {
      return "Không xác định";
    }
    return product.category.name;
  };

  const handleSaveProduct = async (product) => {
    try {
      if (product.id) {
        await API.put(`/admin/product/${product.id}`, product);
      } else {
        await API.post("/admin/product", product);
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {}
  };

  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/admin/product/${id}`);
      fetchProducts();
    } catch (error) {}
  };

  const handleAddProduct = () => {
    setSelectedProduct({});
    setActionType("add");
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setActionType("edit");
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="products-container">
      <header className="home-header">
        <div className="logo">Trang chủ admin</div>
        <div className="left-section">
          {!isMenuOpen && (
            <div className="menu-button" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} /> Menu
            </div>
          )}
          {isMenuOpen && (
            <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
              <button className="close-button" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <ul className="menu-list">
                <li onClick={() => navigate("/admin/home")}>Dashboard</li>
                <li onClick={() => navigate("/admin/products")}>
                  Quản lý sản phẩm
                </li>
                <li onClick={() => navigate("/admin/categories")}>
                  Quản lý mục lục
                </li>
                <li onClick={() => navigate("/admin/users")}>
                  Quản lý người dùng
                </li>
                <li onClick={() => navigate("/admin/orders")}>
                  Quản lý đơn hàng
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="user-menu">
          <div
            className="user-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              alt="User Icon"
              className="user-avatar"
            />
          </div>
          {dropdownOpen && (
            <div className="user-dropdown">
              <button
                className="dropdown-button"
                onClick={() => navigate("/admin/users")}
              >
                Chỉnh sửa người dùng
              </button>
              <button className="dropdown-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <h1>Quản lý sản phẩm</h1>
        <button className="add-button" onClick={handleAddProduct}>
          <FontAwesomeIcon icon={faPlus} /> Thêm sản phẩm
        </button>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}₫</td>
                  <td>{product.stock}</td>
                  <td>{getCategoryName(product)}</td>
                  <td>
                    <button
                      className="action-icon"
                      onClick={() => handleEditProduct(product)}
                    >
                      <FontAwesomeIcon icon={faEdit} title="Sửa" /> Sửa
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} title="Xóa" /> Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Không có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      {isFormOpen && (
        <ProductForm
          product={selectedProduct || {}}
          actionType={actionType}
          onSave={handleSaveProduct}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default ProductList;
