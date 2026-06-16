"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile: top padding accounts for the hamburger button (fixed at top:14)
  const mainPadding = isLoginPage
    ? "0"
    : isMobile
    ? "64px 16px 24px 16px"
    : "32px 36px";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f9f6f4",
    }}>
      {!isLoginPage && <AdminSidebar />}
      <main style={{
        flex: 1,
        minWidth: 0,
        padding: mainPadding,
        overflowX: "hidden",
        overflowY: "auto",
        maxWidth: "100%",
      }}>
        {children}
      </main>
    </div>
  );
}