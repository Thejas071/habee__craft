"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "⊞" },
  { label: "Products", href: "/admin/dashboard", icon: "⬡" },
  { label: "Categories", href: "/admin/dashboard", icon: "▣" },
  { divider: true, label: "CONTENT" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "◎" },
  { label: "Homepage", href: "/admin/homepage", icon: "⌂" },
  { label: "About Page", href: "/admin/about", icon: "ⓘ" },
  { label: "Contact & WhatsApp", href: "/admin/contact", icon: "☎" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  const close = () => setOpen(false);

  // Hamburger line styles — inline to bypass CSS Modules hashing
  const line1Style = open
    ? { top: "50%", transform: "translateY(-50%) rotate(45deg)" }
    : { top: 0 };
  const line2Style = open
    ? { top: "50%", transform: "translateY(-50%)", opacity: 0 }
    : { top: "50%", transform: "translateY(-50%)" };
  const line3Style = open
    ? { top: "50%", transform: "translateY(-50%) rotate(-45deg)" }
    : { top: "100%", transform: "translateY(-100%)" };

  return (
    <>
      {/* ── Mobile hamburger toggle ── */}
      {isMobile && (
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
          aria-expanded={open}
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            zIndex: 1300,
            width: 38,
            height: 38,
            borderRadius: 8,
            background: "var(--card, #fff)",
            border: open ? "1px solid var(--primary, #c9366b)" : "1px solid var(--border, #ede8e5)",
            color: open ? "var(--primary, #c9366b)" : "var(--fg, #1a1614)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: 0,
            transition: "border-color 0.15s, color 0.15s",
          }}
        >
          <span style={{ position: "relative", width: 18, height: 14, display: "block" }}>
            <span style={{
              display: "block", position: "absolute", left: 0, width: "100%",
              height: 1.5, background: "currentColor", borderRadius: 2,
              transformOrigin: "center",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s, top 0.25s cubic-bezier(0.4,0,0.2,1)",
              ...line1Style,
            }} />
            <span style={{
              display: "block", position: "absolute", left: 0, width: "100%",
              height: 1.5, background: "currentColor", borderRadius: 2,
              transformOrigin: "center",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s, top 0.25s cubic-bezier(0.4,0,0.2,1)",
              ...line2Style,
            }} />
            <span style={{
              display: "block", position: "absolute", left: 0, width: "100%",
              height: 1.5, background: "currentColor", borderRadius: 2,
              transformOrigin: "center",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s, top 0.25s cubic-bezier(0.4,0,0.2,1)",
              ...line3Style,
            }} />
          </span>
        </button>
      )}

      {/* ── Overlay (mobile only, no blur — blur was causing sidebar to appear blurred) ── */}
      {isMobile && open && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
            zIndex: 1100,
            // NO backdropFilter — it was causing the sidebar to appear blurred/unclickable
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: "var(--sidebar-width, 240px)",
          minHeight: "100vh",
          background: "var(--sidebar-bg, #fff)",
          borderRight: "1px solid var(--sidebar-border, #ede8e5)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          // Desktop: sticky. Mobile: fixed + slide
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          height: isMobile ? "100dvh" : "100vh",
          overflowY: "auto",
          zIndex: 1200,
          transform: isMobile ? (open ? "translateX(0)" : "translateX(-100%)") : "none",
          transition: isMobile ? "transform 0.28s cubic-bezier(0.4,0,0.2,1)" : "none",
          boxShadow: isMobile && open ? "6px 0 32px rgba(0,0,0,0.12)" : "none",
        }}
      >
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--sidebar-border, #ede8e5)" }}>
          <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <div>
              <div style={{ fontSize: "0.95rem", fontFamily: "var(--font-serif)", fontWeight: 700, color: "var(--fg, #1a1614)", letterSpacing: "-0.01em" }}>Habee Craft</div>
              <div style={{ fontSize: "0.68rem", color: "var(--fg-muted, #a09490)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 1 }}>Admin</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item, i) => {
            if (item.divider) return (
              <div key={i} style={{ padding: "14px 8px 6px", fontSize: "0.65rem", fontWeight: 700, color: "var(--fg-light, #c8bfbc)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {item.label}
              </div>
            );
            const active = isActive(item.href);
            return (
              <Link
                key={i}
                href={item.href}
                onClick={close}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 11px",
                  borderRadius: 7,
                  color: active ? "var(--primary, #c9366b)" : "var(--sidebar-text, #a09490)",
                  background: active ? "var(--primary-light, #fce8f0)" : "transparent",
                  fontWeight: active ? 600 : 400,
                  fontSize: "0.875rem",
                  transition: "all 0.15s",
                  textDecoration: "none",
                  borderLeft: active ? "2px solid var(--primary, #c9366b)" : "2px solid transparent",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--sidebar-hover-bg, #fdf5f2)"; e.currentTarget.style.color = "var(--fg, #1a1614)"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sidebar-text, #a09490)"; } }}
              >
                <span style={{ fontSize: "0.95rem", opacity: 0.8, width: 16, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px", borderTop: "1px solid var(--sidebar-border, #ede8e5)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href="/" target="_blank" style={{
            display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
            borderRadius: 7, color: "var(--fg-muted, #a09490)", fontSize: "0.85rem",
            textDecoration: "none", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--sidebar-hover-bg, #fdf5f2)"; e.currentTarget.style.color = "var(--fg, #1a1614)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-muted, #a09490)"; }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            View Live Site
          </Link>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
            borderRadius: 7, color: "var(--error, #dc2626)", fontSize: "0.85rem",
            background: "transparent", border: "none", cursor: "pointer",
            width: "100%", textAlign: "left", transition: "all 0.15s",
            fontFamily: "var(--font-sans)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--error-bg, #fef2f2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}