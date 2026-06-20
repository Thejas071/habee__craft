"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../Admin.module.css";

export default function AdminContact() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    hours: "",
    map_link: "",
    instagram: "",
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
      const res = await fetch("http://127.0.0.1:8000/contact/");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          address: data.address || "",
          hours: data.hours || "",
          map_link: data.map_link || "",
          instagram: data.instagram || "",
        });
      }
    } catch (err) {
      setError("Could not load contact data.");
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
      const res = await fetch("http://127.0.0.1:8000/contact/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to save contact settings.");
      }

      setSuccess("Contact information updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const whatsappPreview = formData.whatsapp
    ? `https://wa.me/${formData.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I am interested in placing an order.")}`
    : null;

  return (
    <main className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Contact & WhatsApp CMS</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
            Update contact details, business hours, and WhatsApp ordering number.
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
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>Loading current contact info...</p>
          ) : (
            <form onSubmit={handleSave} className={styles.formGrid}>
              {/* Contact Info */}
              <div className={styles.panelHeader} style={{ marginBottom: "8px" }}>
                <h2 className={styles.panelTitle}>Contact Information</h2>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="contactEmail">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. info@habeecraft.com"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="contactPhone">Phone Number</label>
                  <input
                    type="text"
                    id="contactPhone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. +919876543210"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="contactWhatsapp">
                    WhatsApp Number (for Order Button)
                    <span style={{ color: "var(--primary)", fontWeight: "600", marginLeft: "6px" }}>★ Used on product pages</span>
                  </label>
                  <input
                    type="text"
                    id="contactWhatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. +919876543210 (include country code)"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="contactHours">Business Hours</label>
                  <input
                    type="text"
                    id="contactHours"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. Monday to Sunday, 9am - 8pm"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="contactAddress">Address</label>
                <textarea
                  id="contactAddress"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={styles.textareaField}
                  placeholder="E.g. Koramangala, Bangalore, Karnataka, India"
                  rows={2}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="contactInstagram">Instagram Handle / Profile Link</label>
                  <input
                    type="text"
                    id="contactInstagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className={styles.inputField}
                    placeholder="E.g. habee_craft or https://instagram.com/habee_craft"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="contactMapLink">Google Maps Embed Link (Optional)</label>
                  <input
                    type="text"
                    id="contactMapLink"
                    value={formData.map_link}
                    onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                    className={styles.inputField}
                    placeholder="Paste Google Maps embed URL here"
                  />
                </div>
              </div>

              {/* WhatsApp Preview */}
              {formData.whatsapp && (
                <div style={{
                  background: "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "8px",
                }}>
                  <p style={{ fontWeight: "600", marginBottom: "8px", color: "#25D366" }}>
                    ✓ WhatsApp Order Link Preview
                  </p>
                  <a
                    href={whatsappPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--primary)", wordBreak: "break-all", fontSize: "0.85rem" }}
                  >
                    {whatsappPreview}
                  </a>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
                <button type="submit" disabled={loading} className={styles.btnPrimary}>
                  {loading ? "Saving..." : "Save Contact Settings"}
                </button>
                <a
                  href="/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.logoutBtn}
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "10px 20px" }}
                >
                  Preview Contact Page ↗
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
