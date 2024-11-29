import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faBars } from "@fortawesome/free-solid-svg-icons";
import "./Users.css";
import API from "../../api/api";

function UserList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Toggle menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Logout handler
  const handleLogout = () => {
    console.log("Logged out successfully");
    navigate("/admin/login");
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/users");
      console.log("Fetched Users:", response.data);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Edit user
  const handleEditUser = async (updatedUser) => {
    console.log("Editing User:", updatedUser);
    if (!updatedUser._id) {
      alert("Invalid user ID!");
      return;
    }

    try {
      const response = await API.put(
        `/admin/user/${updatedUser._id}`,
        updatedUser
      );
      console.log("Response after update:", response.data);

      // Ensure response has user data
      const updatedUserData = response.data.user || response.data;

      // Update state
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user._id === updatedUser._id ? { ...user, ...updatedUserData } : user
        );
        console.log("Updated Users in State:", updatedUsers);
        return updatedUsers;
      });

      alert("Cập nhật người dùng thành công ✓");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Update failed. Please try again.");
    }
    setEditingUser(null);
    setIsFormOpen(false);
  };

  // Delete user
  const handleDeleteUser = async () => {
    console.log("Deleting User with ID:", confirmDelete.id);
    if (!confirmDelete.id) {
      alert("Invalid user ID!");
      return;
    }

    try {
      await API.delete(`/admin/user/${confirmDelete.id}`);
      console.log("User deleted successfully");
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== confirmDelete.id)
      );
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Delete failed. Please try again.");
    }
    setConfirmDelete({ show: false, id: null });
  };

  // Open edit form
  const openEditForm = (user) => {
    console.log("Opening edit form for user:", user);
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (id) => {
    console.log("Opening delete confirmation for user ID:", id);
    setConfirmDelete({ show: true, id });
  };

  return (
    <div className="users-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo">QUẢN LÝ NGƯỜI DÙNG</div>
        <div className="left-section">
          {!isMenuOpen ? (
            <div className="menu-button" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} /> Menu
            </div>
          ) : (
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
                  Quản lý danh mục
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
                Edit Users
              </button>
              <button className="dropdown-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Users Table */}
      <div className="users-content">
        <h1></h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || index}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="action-icon"
                      onClick={() => openEditForm(user)}
                    >
                      <FontAwesomeIcon icon={faEdit} title="Edit" />
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => openDeleteConfirm(user._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} title="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit User Information</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUser(editingUser);
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={editingUser?.name || ""}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter user name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={editingUser?.email || ""}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter user email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  value={editingUser?.role || ""}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="confirm-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="confirm-actions">
              <button onClick={handleDeleteUser} className="delete-button">
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete({ show: false, id: null })}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
