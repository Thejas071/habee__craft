"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../Admin.module.css";

export default function EditCategory() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Authenticate check
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      loadCategory();
    }
  }, [router]);

  async function loadCategory() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categories/${params.id}`
      );
      if (!response.ok) {
        throw new Error("Category not found");
      }
      const category = await response.json();
      setName(category.name);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categories/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (response.ok) {
        alert("Category Updated Successfully");
        router.push("/admin/dashboard");
      } else {
        const errData = await response.json();
        throw new Error(errData.detail || "Update Failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginCard} style={{ maxWidth: "500px" }}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Edit Category</h1>
          <p className={styles.loginSubtitle}>Update the name of this product category</p>
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

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="catName">Category Name</label>
            <input
              type="text"
              id="catName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.inputField}
              placeholder="E.g. Flower Bouquets"
              required
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={loading}
              className={styles.btnPrimary}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className={styles.logoutBtn}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
