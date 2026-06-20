"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../Admin.module.css";
import { API_URL } from "../../../services/productService";

export default function TestimonialsAdmin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  
  // Testimonials list
  const [testimonials, setTestimonials] = useState([]);
  
  // Status states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: "5.0",
    image: "",
  });

  // Edit states
  const [editingId, setEditingId] = useState(null);

  // Authentication check
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
    } else {
      setToken(savedToken);
      fetchTestimonials();
    }
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/testimonials/`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      setError("Failed to fetch testimonials list.");
    }
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      name: formData.name,
      message: formData.message,
      rating: parseFloat(formData.rating),
      image: formData.image || null,
    };

    const url = editingId 
      ? `${API_URL}/testimonials/${editingId}`
      : `${API_URL}/testimonials/`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit testimonial.");
      }

      setSuccess(editingId ? "Testimonial updated successfully!" : "Testimonial created successfully!");
      setFormData({ name: "", message: "", rating: "5.0", image: "" });
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setError("");
    setSuccess("");

    try {
        const res = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete testimonial.");
      }

      setSuccess("Testimonial deleted successfully.");
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit Mode toggle
  const handleEditClick = (t) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      message: t.message,
      rating: t.rating.toString(),
      image: t.image || "",
    });
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", message: "", rating: "5.0", image: "" });
  };

  return (
    <div className={styles.mainPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          {editingId ? "Edit Testimonial" : "Manage Testimonials"}
        </h2>
      </div>

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

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.formGrid} style={{ marginBottom: "40px" }}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="clientName">Customer Name</label>
            <input
              type="text"
              id="clientName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.inputField}
              placeholder="E.g. Sneha Reddy"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="clientRating">Rating (1 to 5 Stars)</label>
            <select
              id="clientRating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className={styles.selectField}
              required
            >
              <option value="5.0">5 Stars (Excellent)</option>
              <option value="4.0">4 Stars (Good)</option>
              <option value="3.0">3 Stars (Average)</option>
              <option value="2.0">2 Stars (Poor)</option>
              <option value="1.0">1 Star (Very Poor)</option>
            </select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="clientImage">Avatar Image Filename / URL (Optional)</label>
          <input
            type="text"
            id="clientImage"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className={styles.inputField}
            placeholder="E.g. client_avatar.jpg (Leave blank for generic initials)"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="clientMessage">Customer Review Message</label>
          <textarea
            id="clientMessage"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={styles.textareaField}
            placeholder="Write customer comments here..."
            required
          ></textarea>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="submit" disabled={loading} className={styles.btnPrimary}>
            {editingId ? "Update Testimonial" : "Create Testimonial"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className={styles.logoutBtn}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <h3 className={styles.panelTitle} style={{ fontSize: "1.4rem", marginBottom: "16px" }}>Testimonials List</h3>
      {testimonials.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>
          No custom testimonials in database. Showing fallback items on public site.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: "600" }}>{t.name}</td>
                  <td style={{ color: "#f59e0b", fontWeight: "700" }}>★ {t.rating}</td>
                  <td style={{ maxWidth: "350px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.message}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleEditClick(t)}
                        className={styles.btnEdit}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className={styles.btnDelete}
                        title="Delete Review"
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
  );
}
