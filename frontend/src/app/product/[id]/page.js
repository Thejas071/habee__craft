"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getProduct } from "../../../services/productService";
import { useCart } from "../../../context/CartContext";
import styles from "../Product.module.css";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(params.id);
        if (data && !data.detail) {
          setProduct(data);
          setActiveImage(data.image);
        }
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.pageContainer} style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.pageContainer} style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Product not found</h2>
        <Link href="/shop" className={styles.backLink} style={{ margin: "20px auto 0" }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const categoryLabel = product.category_id === 1 ? "Bouquet" : "Handmade Craft";

  // Combine cover image and gallery images for a full list of images
  const allImages = product.gallery && product.gallery.length > 0 
    ? [product.image, ...product.gallery] 
    : [product.image];

  return (
    <div className={styles.pageContainer}>
      {/* Back Link */}
      <Link href="/shop" className={styles.backLink}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Collection</span>
      </Link>

      {/* Main product layout card */}
      <div className={styles.productLayout}>
        {/* Left Column: Gallery Viewer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.imageSection}>
            <img
              src={`http://127.0.0.1:8000/uploads/products/${activeImage}`}
              alt={product.name}
              className={styles.productImage}
            />
          </div>

          {/* Thumbnails list */}
          {allImages.length > 1 && (
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
              {allImages.map((imgName, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgName)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: activeImage === imgName ? "2.5px solid var(--rose)" : "1.5px solid var(--border-sm)",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000/uploads/products/${imgName}`}
                    alt={`${product.name} gallery ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className={styles.infoSection}>
          <span className={styles.categoryBadge}>{categoryLabel}</span>
          
          <h1 className={styles.productName}>{product.name}</h1>
          
          <span className={styles.productPrice}>₹{product.price}</span>

          <div className={styles.divider}></div>

          <div>
            <h4 className={styles.descriptionTitle}>Description</h4>
            <p className={styles.productDescription}>{product.description}</p>
          </div>

          <div className={styles.divider}></div>

          {/* Secure Purchase Checklist */}
          <div className={styles.metaList}>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>100% Handcrafted item</span>
            </div>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Secured and padded gift packaging</span>
            </div>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Cash on delivery / Online payments supported</span>
            </div>
          </div>

          {/* Add to Basket button (Replaces the direct buy button) */}
          <button
            onClick={() => addToCart(product)}
            className={styles.buyButton}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--rose)",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Add to Basket</span>
          </button>
        </div>
      </div>
    </div>
  );
}