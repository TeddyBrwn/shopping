import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./Modal.css";

function ProductForm({ product = {}, actionType, onSave, onCancel }) {
  const [formValues, setFormValues] = useState({
    name: product.name || "",
    price: product.price || 0,
    stock: product.stock || 0,
    category: product.category || "",
    description: product.description || "",
    attributes: product.attributes || [
      {
        key: "Màu",
        value:
          product.attributes?.find((attr) => attr.key === "Màu")?.value ||
          "#000000",
      },
      {
        key: "Kích thước",
        value:
          product.attributes?.find((attr) => attr.key === "Kích thước")
            ?.value || "M",
      },
    ],
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/admin/categories");
        setCategories(response.data);
      } catch (error) {}
    };
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc.";
    }
    if (formValues.price <= 0) {
      newErrors.price = "Giá sản phẩm phải lớn hơn 0.";
    }
    if (formValues.stock < 0) {
      newErrors.stock = "Số lượng sản phẩm phải lớn hơn hoặc bằng 0.";
    }
    if (!formValues.category) {
      newErrors.category = "Danh mục là bắt buộc.";
    }
    if (!formValues.image) {
      newErrors.image = "Vui lòng tải lên hình ảnh sản phẩm.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...formValues.attributes];
    updatedAttributes[index][field] = value;
    setFormValues({ ...formValues, attributes: updatedAttributes });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...formValues, id: product._id });
    }
  };

  const basicColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#000000",
    "#FFFFFF",
    "#808080",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <div className="modal-header">
          {actionType === "add" ? "Thêm Sản Phẩm" : "Sửa Sản Phẩm"}
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="price">Giá sản phẩm</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formValues.price}
              onChange={handleChange}
            />
            {errors.price && <div className="error-text">{errors.price}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="stock">Số lượng sản phẩm</label>
            <input
              type="text"
              id="stock"
              name="stock"
              value={formValues.stock}
              onChange={handleChange}
            />
            {errors.stock && <div className="error-text">{errors.stock}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={formValues.category}
              onChange={handleChange}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="error-text">{errors.category}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="color">Màu sắc</label>
            <div className="color-picker">
              {basicColors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${
                    formValues.attributes[0]?.value === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleAttributeChange(0, "value", color)}
                />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="size">Kích thước</label>
            <select
              id="size"
              name="size"
              value={formValues.attributes[1]?.value}
              onChange={(e) =>
                handleAttributeChange(1, "value", e.target.value)
              }
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image">Hình ảnh sản phẩm</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setFormValues({ ...formValues, image: e.target.files[0] })
              }
            />
            {errors.image && <div className="error-text">{errors.image}</div>}
          </div>
          <div className="form-group">
            <button
              type="button"
              className="save-button"
              onClick={handleSubmit}
            >
              Lưu
            </button>
            <button type="button" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
