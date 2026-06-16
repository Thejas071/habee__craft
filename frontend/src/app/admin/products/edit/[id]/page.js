"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../Admin.module.css";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category_id: "",
    gallery: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    setFetching(true);
    try {
      const [productRes, catRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/products/${params.id}`),
        fetch("http://127.0.0.1:8000/categories/"),
      ]);
      const product = await productRes.json();
      const cats = await catRes.json();
      setCategories(cats);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        image: product.image || "",
        category_id: product.category_id?.toString() || "",
        gallery: product.gallery || [],
      });
    } catch (err) {
      setError("Failed to load product data. Make sure the backend is running.");
    } finally {
      setFetching(false);
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingGallery(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const uploadedNames = [];
      for (const file of files) {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        const res = await fetch("http://127.0.0.1:8000/upload/", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataObj,
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Gallery image upload failed.");
        }
        const data = await res.json();
        uploadedNames.push(data.filename);
      }
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedNames]
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = (filename) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((name) => name !== filename)
    }));
  };

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`http://127.0.0.1:8000/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
          category_id: Number(formData.category_id),
          gallery: formData.gallery || [],
        }),
      });

      if (response.ok) {
        setSuccess("Product updated successfully!");
        setTimeout(() => router.push("/admin/dashboard"), 1200);
      } else {
        const errData = await response.json();
        throw new Error(errData.detail || "Update failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div style={{ maxWidth: "760px" }}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Product</h1>
          <p className={styles.pageSubtitle}>Update product information — changes will reflect immediately on the shop.</p>
        </div>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className={styles.btnGhost}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className={styles.alertError}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className={styles.alertSuccess}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}

      {/* Form Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Product Details</span>
          {formData.image && (
            <img
              src={`http://127.0.0.1:8000/uploads/products/${formData.image}`}
              alt="Current product"
              style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "2px solid var(--primary-light)" }}
            />
          )}
        </div>

        <div className={styles.cardBody}>
          {fetching ? (
            <div className={styles.emptyState}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading product data...</div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className={styles.form}>
              {/* Row 1: Name + Price */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="prodName">Product Name</label>
                  <input
                    id="prodName"
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    className={styles.input}
                    placeholder="E.g. Premium Red Rose Bouquet"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="prodPrice">Price (₹ INR)</label>
                  <input
                    id="prodPrice"
                    type="number"
                    value={formData.price}
                    onChange={handleChange("price")}
                    className={styles.input}
                    placeholder="E.g. 1299"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category + Image filename */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="prodCategory">Category</label>
                  <select
                    id="prodCategory"
                    value={formData.category_id}
                    onChange={handleChange("category_id")}
                    className={styles.select}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="prodImage">
                    Image Filename
                    <span className={styles.labelHint} style={{ marginLeft: "6px" }}>(stored in server)</span>
                  </label>
                  <input
                    id="prodImage"
                    type="text"
                    value={formData.image}
                    onChange={handleChange("image")}
                    className={styles.input}
                    placeholder="E.g. product_12345.jpg"
                  />
                </div>
              </div>

              {/* Gallery upload and preview */}
              <div className={styles.formGroup} style={{ marginBottom: "20px" }}>
                <label className={styles.label} htmlFor="prodGallery">
                  Gallery Images
                  <span className={styles.labelHint} style={{ marginLeft: "6px" }}>(select multiple to add to product carousel)</span>
                </label>
                <input
                  id="prodGallery"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className={styles.input}
                  disabled={uploadingGallery}
                />
                {uploadingGallery && (
                  <span style={{ fontSize: "0.85rem", color: "var(--primary)", marginTop: "4px", display: "block" }}>
                    Uploading gallery images...
                  </span>
                )}
                {formData.gallery && formData.gallery.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} style={{ position: "relative", width: "70px", height: "70px", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                        <img src={`http://127.0.0.1:8000/uploads/products/${img}`} alt="gallery preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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


              {/* Description */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="prodDesc">Description</label>
                <textarea
                  id="prodDesc"
                  value={formData.description}
                  onChange={handleChange("description")}
                  className={styles.textarea}
                  placeholder="Describe the product — flowers, size, customization options..."
                  required
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px", paddingTop: "4px", flexWrap: "wrap" }}>
                <button type="submit" disabled={loading} className={styles.btnPrimary}>
                  {loading ? (
                    <>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}