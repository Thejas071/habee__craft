"use client";

import { useState, useEffect } from "react";
import styles from "./Contact.module.css";
import { API_URL } from "../../services/productService";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/contact/`)
      .then((r) => r.json())
      .then((d) => setContactInfo(d))
      .catch(() => {});
  }, []);

  const email = contactInfo?.email || "info@habeecraft.com";
  const phone = contactInfo?.phone || "+919876543210";
  const whatsapp = contactInfo?.whatsapp || "+919876543210";
  const address = contactInfo?.address || "Koramangala, Bangalore, Karnataka, India";
  const hours = contactInfo?.hours || "Monday to Sunday, 9am - 8pm";
  const instagram = contactInfo?.instagram || "habee_craft";

  // Build Instagram URL — supports both handle and full URL
  const instagramUrl = instagram.startsWith("http")
    ? instagram
    : `https://www.instagram.com/${instagram.replace(/^@/, "")}/`;

  const instagramHandle = instagram.startsWith("http")
    ? "@" + instagram.split("instagram.com/")[1]?.replace(/\/$/, "")
    : "@" + instagram.replace(/^@/, "");

  return (
    <main className={styles.contactContainer}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>Get In Touch</h1>
        <p className={styles.subtitle}>Have questions about custom hampers or bouquets? Let's connect.</p>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactLayout}>
          {/* Left: Info Grid */}
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Email Us</h3>
                <p className={styles.infoDetail}>{email}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Call Us</h3>
                <p className={styles.infoDetail}>{phone}</p>
                <p className={styles.infoDetail} style={{ fontSize: "0.85rem", marginTop: 4 }}>{hours}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>WhatsApp</h3>
                <p className={styles.infoDetail}>{whatsapp}</p>
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.85rem", color: "var(--rose)", fontWeight: 600, marginTop: 4, display: "inline-block" }}
                >
                  Chat with us →
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Studio Location</h3>
                <p className={styles.infoDetail}>{address}</p>
              </div>
            </div>
          </div>

          {/* Right: Instagram Card */}
          <div className={styles.formCard} style={{ alignItems: "center", justifyContent: "center", textAlign: "center", gap: 32 }}>
            {/* Instagram gradient icon */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "22px",
              background: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(238,42,123,0.3)",
            }}>
              <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
              </svg>
            </div>

            <div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.7rem", color: "#1e1414", marginBottom: 8 }}>
                Follow Us on Instagram
              </h2>
              <p style={{ color: "#8a7f7c", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 320, margin: "0 auto 24px" }}>
                See our latest creations, behind-the-scenes moments, and special collections on Instagram.
              </p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagramBtn}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white" style={{ flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                </svg>
                {instagramHandle}
              </a>
            </div>

            <p style={{ color: "#c8bfbc", fontSize: "0.82rem", marginTop: 8 }}>
              Click to open Instagram profile in a new tab
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}