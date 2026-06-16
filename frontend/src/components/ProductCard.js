"use client";

import Link from "next/link";
import styles from "../app/shop/shop.module.css"; // adjust path if needed

export default function ProductCard({ product }) {
  return (
    <Link
      key={product.id}
      href={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className={styles.productCard}>
        <div className={styles.imageContainer}>
          {product.image ? (
            <img
              src={`http://127.0.0.1:8000/uploads/products/${product.image}`}
              alt={product.name}
              className={styles.productImage}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf8f5", color: "#a09490" }}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
          )}
        </div>
        <div className={styles.productContent}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.cardFooter}>
            <span className={styles.productPrice}>₹{product.price}</span>
            <span className={styles.viewDetailsBtn}>Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
