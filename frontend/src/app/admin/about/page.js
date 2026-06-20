"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../Admin.module.css";
import { API_URL } from "../../../services/productService";

export default function AdminAbout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    description2: "",
    value1_title: "",
    value1_text: "",
    value2_title: "",
    value2_text: "",
    value3_title: "",
    value3_text: "",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/about/`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          description2: data.description2 || "",
          value1_title: data.value1_title || "",
          value1_text: data.value1_text || "",
          value2_title: data.value2_title || "",
          value2_text: data.value2_text || "",
          value3_title: data.value3_title || "",
          value3_text: data.value3_text || "",
        });
      }
    } catch (err) {
      setError("Could not load About page data.");
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
      const res = await fetch(`${API_URL}/about/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to save about page settings.");
      }

      setSuccess("About page content updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>About Page CMS</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
            Edit your brand story, mission, and core values.
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
          {fetching ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>Loading current content...</p>
          ) : (
            <form onSubmit={handleSave} className={styles.formGrid}>
              {/* Page Header */}
              <div className={styles.panelHeader} style={{ marginBottom: "8px" }}>
                <h2 className={styles.panelTitle}>Page Header</h2>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="aboutTitle">Page Title</label>
                  <input
                    type="text"
                    id="aboutTitle"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. About Habee Craft"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="aboutSubtitle">Subtitle</label>
                  <input
                    type="text"
                    id="aboutSubtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. Our story, our passion..."
                  />
                </div>
              </div>

              {/* Story Section */}
              <div className={styles.panelHeader} style={{ marginBottom: "8px", marginTop: "16px" }}>
                <h2 className={styles.panelTitle}>Brand Story</h2>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="aboutDesc">Main Description (Paragraph 1)</label>
                <textarea
                  id="aboutDesc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textareaField}
                  placeholder="Your main brand story..."
                  rows={4}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="aboutDesc2">Additional Story (Paragraph 2 - Optional)</label>
                <textarea
                  id="aboutDesc2"
                  value={formData.description2}
                  onChange={(e) => setFormData({ ...formData, description2: e.target.value })}
                  className={styles.textareaField}
                  placeholder="Optional second paragraph..."
                  rows={3}
                />
              </div>

              {/* Core Values */}
              <div className={styles.panelHeader} style={{ marginBottom: "8px", marginTop: "16px" }}>
                <h2 className={styles.panelTitle}>Core Values (3 Cards)</h2>
              </div>

              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor={`val${n}title`}>Value {n} Title</label>
                    <input
                      type="text"
                      id={`val${n}title`}
                      value={formData[`value${n}_title`]}
                      onChange={(e) => setFormData({ ...formData, [`value${n}_title`]: e.target.value })}
                      className={styles.inputField}
                      placeholder={`E.g. Core Value ${n}`}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor={`val${n}text`}>Value {n} Description</label>
                    <input
                      type="text"
                      id={`val${n}text`}
                      value={formData[`value${n}_text`]}
                      onChange={(e) => setFormData({ ...formData, [`value${n}_text`]: e.target.value })}
                      className={styles.inputField}
                      placeholder="Short description..."
                    />
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={loading} className={styles.btnPrimary}>
                  {loading ? "Saving..." : "Save About Page Content"}
                </button>
                <a
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoutBtn}
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "10px 20px" }}
                >
                  Preview About ↗
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
