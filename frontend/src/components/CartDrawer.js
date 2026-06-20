"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import styles from "./CartDrawer.module.css";
import { API_URL } from "../services/productService";

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [whatsappNumber, setWhatsappNumber] = useState("919876543210");

  useEffect(() => {
    async function fetchNumber() {
      try {
        const res = await fetch(`${API_URL}/contact/`);
        if (res.ok) {
          const data = await res.json();
          const cleanNum = (data.whatsapp || "+919876543210").replace(/\D/g, "");
          if (cleanNum) setWhatsappNumber(cleanNum);
        }
      } catch (e) {
        console.error("Failed to fetch WhatsApp number in drawer", e);
      }
    }
    fetchNumber();
  }, []);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    // Construct beautiful itemized message
    let message = "🌸 *HABEE CRAFT - NEW QUOTE REQUEST* 🌸\n\n";
    message += "Hello! I would like to get a quote for the following items:\n\n";

    cartItems.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Est. Price: ₹${item.price} each\n`;
      message += `   Subtotal: ₹${item.price * item.quantity}\n\n`;
    });

    message += `*Estimated Total Value:* ₹${cartTotal}\n\n`;
    message += "Please confirm availability and sharing details for payment & shipping. Thank you! ✨";

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            Quote Basket{" "}
            {cartItems.length > 0 && (
              <span className={styles.itemCountBadge}>{cartItems.length}</span>
            )}
          </h3>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.itemsContainer}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                viewBox="0 0 24 24"
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p style={{ fontWeight: "600", fontSize: "1.1rem", color: "var(--text)" }}>
                Your basket is empty
              </p>
              <p style={{ fontSize: "0.9rem" }}>
                Browse our premium collection and add items to request a custom quote.
              </p>
              <button className={styles.shopBtn} onClick={() => setIsOpen(false)}>
                Continue Browsing
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className={styles.cartItem} key={item.id}>
                <img
                  src={`${API_URL}/uploads/products/${item.image}`}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
                  
                  <div className={styles.itemActions}>
                    {/* Quantity Selector */}
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Estimated Total</span>
              <span className={styles.totalValue}>₹{cartTotal}</span>
            </div>
            
            <button className={styles.whatsappButton} onClick={handleWhatsAppCheckout}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Send Inquiry via WhatsApp</span>
            </button>
            
            <p className={styles.noteText}>
              Inquiry is itemized and formatted automatically.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
