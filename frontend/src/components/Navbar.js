"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useCart } from "../context/CartContext";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Reviews", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { cartCount, setIsOpen } = useCart();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Hide on admin pages — admin has its own sidebar header
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href) => href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const close = () => setOpen(false);

  // Inline styles for hamburger lines — bypasses CSS Modules scoping issue
  const line1Style = open
    ? { top: "50%", transform: "translateY(-50%) rotate(45deg)" }
    : {};
  const line2Style = open
    ? { opacity: 0, transform: "translateY(-50%) scaleX(0)" }
    : {};
  const line3Style = open
    ? { top: "50%", transform: "translateY(-50%) rotate(-45deg)" }
    : {};

  return (
    <>
      {/* Overlay — rendered outside nav so z-index stacking works correctly */}
      {open && (
        <div
          className={styles.mobileOverlay}
          onClick={close}
          aria-hidden="true"
        />
      )}

      <nav className={styles.navContainer}>
        {/* Logo */}
        <Link href="/" className={styles.logoArea} onClick={close}>
          <img src="/logo.png" alt="Habee Craft Logo" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
          <span style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)", fontWeight: "600", color: "#1a1614", textTransform: "uppercase", letterSpacing: "0.06em" }}>Habee Craft</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.navLinks}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.activeNavLink : ""}`}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/admin/dashboard"
            className={`${styles.adminLink} ${isActive("/admin") ? styles.adminLinkActive : ""}`}
          >
            Admin
          </Link>
        </div>

        {/* Right Controls */}
        <div className={styles.rightControls}>
          <button
            onClick={() => setIsOpen(true)}
            className={styles.cartButton}
            aria-label="Open Quote Basket"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>

          {/* Hamburger button */}
          <button
            onClick={() => setOpen(prev => !prev)}
            className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className={styles.hamburgerIcon}>
              <span className={styles.hamburgerLine} style={line1Style} />
              <span className={styles.hamburgerLine} style={line2Style} />
              <span className={styles.hamburgerLine} style={line3Style} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer — outside nav so it layers on top correctly */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`} aria-hidden={!open}>
        {/* Close button inside drawer */}
        <button
          onClick={close}
          className={styles.drawerClose}
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #ede8e5" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "#c9366b", fontSize: "1rem", letterSpacing: "-0.01em" }}>Habee Craft</div>
        </div>

        {navItems.map(item => (
          <Link key={item.href} href={item.href} onClick={close}
            className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.activeMobileNavLink : ""}`}
          >
            {item.name}
          </Link>
        ))}

        <Link href="/admin/dashboard" onClick={close}
          style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #ede8e5", display: "block", fontSize: "0.78rem", color: "#b0aaa8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "16px 14px 0" }}
        >
          Admin Portal →
        </Link>
      </div>
    </>
  );
}