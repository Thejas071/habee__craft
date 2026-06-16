"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../Admin.module.css";

export default function AdminHomepage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_button_text: "",
    section_title: "",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
    } else {
      setToken(savedToken);
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/homepage/");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_button_text: data.hero_button_text || "",
          section_title: data.section_title || "",
        });
      }
    } catch (err) {
      setError("Could not load homepage data. Make sure the backend is running.");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const savedToken = localStorage.getItem("admin_token");
      const res = await fetch("http://127.0.0.1:8000/homepage/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to save homepage settings.");
      }

      setSuccess("Homepage content updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Homepage CMS</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
            Edit the hero section and featured content on your public homepage.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/admin/dashboard")} className={styles.logoutBtn}>
            ← Dashboard
          </button>
          <button
            onClick={() => { localStorage.removeItem("admin_token"); router.push("/admin/login"); }}
            className={styles.logoutBtn}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      <div className={styles.dashboardContent} style={{ display: "block" }}>
        <div className={styles.mainPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Hero Section Content</h2>
          </div>

          {fetching ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>Loading current content...</p>
          ) : (
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="heroTitle">Hero Title</label>
                <input
                  type="text"
                  id="heroTitle"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  className={styles.inputField}
                  placeholder="E.g. Handmade Gifts & Premium Bouquets"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="heroSubtitle">Hero Subtitle / Description</label>
                <textarea
                  id="heroSubtitle"
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  className={styles.textareaField}
                  placeholder="E.g. Discover beautiful handcrafted gifts..."
                  rows={3}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="heroBtn">Hero Button Text</label>
                  <input
                    type="text"
                    id="heroBtn"
                    value={formData.hero_button_text}
                    onChange={(e) => setFormData({ ...formData, hero_button_text: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. Shop Collection"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="sectionTitle">Features Section Title</label>
                  <input
                    type="text"
                    id="sectionTitle"
                    value={formData.section_title}
                    onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. Why Choose Habee Craft?"
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
                <button type="submit" disabled={loading} className={styles.btnPrimary}>
                  {loading ? "Saving..." : "Save Homepage Content"}
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoutBtn}
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "10px 20px" }}
                >
                  Preview Homepage ↗
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
