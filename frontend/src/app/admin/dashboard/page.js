"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../Admin.module.css";
import { API_URL } from "../../../services/productService";

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  // Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Status states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState(null);

  // Forms states
  const [prodForm, setProdForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    gallery: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [catName, setCatName] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Authentication check
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
    } else {
      setToken(savedToken);
      fetchDashboardData(savedToken);
    }
  }, [router]);

  const fetchDashboardData = async (authToken) => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Fetch Products
      const prodRes = await fetch(`${API_URL}/products/`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      // Fetch Categories
      const catRes = await fetch(`${API_URL}/categories/`);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
        if (catData.length > 0) {
          setProdForm((prev) => ({ ...prev, category_id: catData[0].id.toString() }));
        }
      }

      // Fetch Recovery Code
      const recRes = await fetch(`${API_URL}/auth/recovery-code`, { headers });
      if (recRes.ok) {
        const recData = await recRes.json();
        if (recData.code) {
          setRecoveryCode(recData.code);
        }
      }
    } catch (err) {
      setError("Failed to fetch dashboard data. Please make sure the backend is running.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch(`${API_URL}/upload/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Image upload failed.");
    }

    const data = await res.json();
    return data.filename;
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingGallery(true);
    setError("");
    try {
      const uploadedNames = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_URL}/upload/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Gallery image upload failed.");
        }
        const data = await res.json();
        uploadedNames.push(data.filename);
      }
      setProdForm((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedNames]
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingGallery(false);
      e.target.value = ""; // reset input
    }
  };

  const handleRemoveGalleryImage = (filename) => {
    setProdForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((name) => name !== filename)
    }));
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!imageFile) {
        throw new Error("Please select an image file to upload.");
      }

      // 1. Upload image first
      const filename = await uploadImage();

      // 2. Submit product details
      const productPayload = {
        name: prodForm.name,
        description: prodForm.description,
        price: parseFloat(prodForm.price),
        image: filename,
        category_id: parseInt(prodForm.category_id),
        gallery: prodForm.gallery || [],
      };

      const res = await fetch(`${API_URL}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create product.");
      }

      setSuccess("Product added successfully!");
      // Reset form
      setProdForm({
        name: "",
        description: "",
        price: "",
        category_id: categories[0]?.id.toString() || "",
        gallery: [],
      });
      setImageFile(null);
      // Refresh list
      fetchDashboardData(token);
      setActiveTab("products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete product.");
      }

      setSuccess("Product deleted successfully.");
      fetchDashboardData(token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create category.");
      }

      setSuccess("Category created successfully!");
      setCatName("");
      fetchDashboardData(token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete category.");
      }

      setSuccess("Category deleted successfully.");
      fetchDashboardData(token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate dynamic stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const avgPrice = totalProducts > 0
    ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts)
    : 0;

  return (
    <main className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
            Manage categories, upload product images, and list store items.
          </p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className={styles.errorBanner}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className={styles.successBanner}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{success}</span>
        </div>
      )}

      {recoveryCode && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", padding: "16px", borderRadius: "8px", marginBottom: "28px" }}>
          <h3 style={{ color: "#b45309", marginBottom: "8px", fontWeight: "bold", fontSize: "1rem" }}>⚠️ Important: Save Your Password Recovery Code</h3>
          <p style={{ color: "#92400e", fontSize: "0.9rem", marginBottom: "12px" }}>
            This is your one-time password recovery code. Please copy and store it securely. <strong>It will never be shown again.</strong>
          </p>
          <div style={{ display: "inline-block", background: "#fffbeb", padding: "8px 16px", borderRadius: "4px", border: "1px dashed #d97706", fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold", color: "#b45309" }}>
            {recoveryCode}
          </div>
        </div>
      )}

      {/* Metrics Widgets */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalProducts}</span>
          <span className={styles.statLabel}>Total Products</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalCategories}</span>
          <span className={styles.statLabel}>Categories</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>₹{avgPrice}</span>
          <span className={styles.statLabel}>Average Price</span>
        </div>
      </div>

      {/* Workspace Panel */}
      <div className={styles.dashboardContent}>
        {/* Sidebar Nav */}
        <div className={styles.sidebar}>
          <button
            onClick={() => { setActiveTab("products"); setError(""); setSuccess(""); }}
            className={`${styles.tabBtn} ${activeTab === "products" ? styles.activeTabBtn : ""}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <span>Products List</span>
          </button>

          <button
            onClick={() => { setActiveTab("add-product"); setError(""); setSuccess(""); }}
            className={`${styles.tabBtn} ${activeTab === "add-product" ? styles.activeTabBtn : ""}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Product</span>
          </button>

          <button
            onClick={() => { setActiveTab("categories"); setError(""); setSuccess(""); }}
            className={`${styles.tabBtn} ${activeTab === "categories" ? styles.activeTabBtn : ""}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Categories</span>
          </button>

          {/* CMS Section Divider */}
          <div style={{ borderTop: "1px solid var(--border)", margin: "12px 0 8px", paddingTop: "8px", width: "100%" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600", padding: "0 4px" }}>CMS Pages</span>
          </div>

          <button
            onClick={() => router.push("/admin/testimonials")}
            className={styles.tabBtn}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Testimonials</span>
          </button>

          <button
            onClick={() => router.push("/admin/homepage")}
            className={styles.tabBtn}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Homepage CMS</span>
          </button>

          <button
            onClick={() => router.push("/admin/about")}
            className={styles.tabBtn}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>About CMS</span>
          </button>

          <button
            onClick={() => router.push("/admin/contact")}
            className={styles.tabBtn}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>Contact CMS</span>
          </button>
        </div>

        {/* Main Work Area */}
        <div className={styles.mainPanel}>
          {/* TAB 1: PRODUCTS TABLE */}
          {activeTab === "products" && (
            <div>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Store Products</h2>
              </div>

              {products.length === 0 ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
                  No products added yet. Click &ldquo;Add Product&rdquo; to create your first item.
                </p>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const cat = categories.find((c) => c.id === p.category_id);
                        return (
                          <tr key={p.id}>
                            <td>
                              <img
                                src={`${API_URL}/uploads/products/${p.image}`}
                                alt={p.name}
                                className={styles.thumbnail}
                              />
                            </td>
                            <td style={{ fontWeight: "600" }}>{p.name}</td>
                            <td>{cat ? cat.name : `ID: ${p.category_id}`}</td>
                            <td style={{ color: "var(--primary)", fontWeight: "700" }}>₹{p.price}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    router.push(`/admin/products/edit/${p.id}`)
                                  }
                                  className={styles.btnEdit}
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className={styles.btnDelete}
                                  title="Delete Product"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD PRODUCT FORM */}
          {activeTab === "add-product" && (
            <div>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Add New Product</h2>
              </div>

              {categories.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                    You need to create at least one Category before you can add products.
                  </p>
                  <button onClick={() => setActiveTab("categories")} className={styles.btnPrimary} style={{ margin: "0 auto" }}>
                    Create Category
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddProduct} className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="prodName">Product Name</label>
                      <input
                        type="text"
                        id="prodName"
                        value={prodForm.name}
                        onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                        className={styles.inputField}
                        placeholder="E.g. Premium Red Rose Bouquet"
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="prodPrice">Price (INR)</label>
                      <input
                        type="number"
                        id="prodPrice"
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        className={styles.inputField}
                        placeholder="E.g. 1299"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="prodCategory">Category</label>
                      <select
                        id="prodCategory"
                        value={prodForm.category_id}
                        onChange={(e) => setProdForm({ ...prodForm, category_id: e.target.value })}
                        className={styles.selectField}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id.toString()}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel} htmlFor="prodImage">Product Main Image</label>
                      <input
                        type="file"
                        id="prodImage"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className={styles.inputField}
                        required
                      />
                    </div>
                  </div>



                  <div className={styles.inputGroup} style={{ marginBottom: "16px" }}>
                    <label className={styles.inputLabel} htmlFor="prodGallery">Gallery Images (Optional)</label>
                    <input
                      type="file"
                      id="prodGallery"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className={styles.inputField}
                      disabled={uploadingGallery}
                    />
                    {uploadingGallery && (
                      <span style={{ fontSize: "0.85rem", color: "var(--primary)", marginTop: "4px", display: "block" }}>
                        Uploading gallery images...
                      </span>
                    )}
                    {prodForm.gallery && prodForm.gallery.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                        {prodForm.gallery.map((img, idx) => (
                          <div key={idx} style={{ position: "relative", width: "70px", height: "70px", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                            <img src={`${API_URL}/uploads/products/${img}`} alt="gallery preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(img)}
                              style={{ position: "absolute", top: 2, right: 2, background: "rgba(220, 38, 38, 0.85)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="prodDesc">Description</label>
                    <textarea
                      id="prodDesc"
                      value={prodForm.description}
                      onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      className={styles.textareaField}
                      placeholder="Describe the flowers, hampers size, customization options..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" disabled={loading} className={styles.btnPrimary} style={{ alignSelf: "flex-start", marginTop: "12px" }}>
                    {loading ? "Adding Product..." : "Create Product"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGER */}
          {activeTab === "categories" && (
            <div>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Manage Categories</h2>
              </div>

              {/* Add category inline form */}
              <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "12px", marginBottom: "32px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div className={styles.inputGroup} style={{ flex: "1 1 200px" }}>
                  <label className={styles.inputLabel} htmlFor="catInput">New Category Name</label>
                  <input
                    type="text"
                    id="catInput"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className={styles.inputField}
                    placeholder="E.g. Flower Bouquets"
                    required
                  />
                </div>
                <button type="submit" className={styles.btnPrimary} style={{ height: "46px" }}>
                  Add
                </button>
              </form>

              {/* Categories list */}
              {categories.length === 0 ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>
                  No categories created yet.
                </p>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Category ID</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td style={{ fontWeight: "600" }}>{c.name}</td>
                          <td>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <button
                                onClick={() => router.push(`/admin/categories/edit/${c.id}`)}
                                className={styles.btnEdit}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.id)}
                                className={styles.btnDelete}
                                title="Delete Category"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
