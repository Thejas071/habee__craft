"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);

  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const handleSearch = (e) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(`/shop?search=${value}&sort=${currentSort}`);
    }, 400);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        background: "#ffffff",
        border: "1.5px solid #edddd8",
        borderRadius: "14px",
        transition: "all 0.25s ease",
        boxShadow: "0 1px 3px rgba(180,100,100,0.06)",
        width: "100%",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#c9366b";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,54,107,0.10)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#edddd8";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(180,100,100,0.06)";
      }}
    >
      {/* Search Icon */}
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="#a09490"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        placeholder="Search handcrafted items, flowers, gifts..."
        defaultValue={currentSearch}
        onChange={handleSearch}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "0.95rem",
          color: "#1e1414",
          fontFamily: "inherit",
          letterSpacing: "0.01em",
        }}
      />
    </div>
  );
}