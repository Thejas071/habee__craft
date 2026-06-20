"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";

  function handleSort(event) {
    const sort = event.target.value;
    router.push(`/shop?search=${currentSearch}&sort=${sort}`);
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Sort Icon */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="#a09490"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: "16px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="14" y2="12" />
        <line x1="4" y1="18" x2="8" y2="18" />
      </svg>

      <select
        onChange={handleSort}
        value={currentSort}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          padding: "14px 44px 14px 42px",
          background: "#ffffff",
          border: "1.5px solid #edddd8",
          borderRadius: "14px",
          fontSize: "0.95rem",
          color: "#1e1414",
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "all 0.25s ease",
          boxShadow: "0 1px 3px rgba(180,100,100,0.06)",
          minWidth: "200px",
          letterSpacing: "0.01em",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#c9366b";
          e.target.style.boxShadow = "0 4px 16px rgba(201,54,107,0.10)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#edddd8";
          e.target.style.boxShadow = "0 1px 3px rgba(180,100,100,0.06)";
        }}
      >
        <option value="newest">Newest First</option>
        <option value="low_to_high">Price: Low → High</option>
        <option value="high_to_low">Price: High → Low</option>
      </select>

      {/* Chevron Down Icon */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="#a09490"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          right: "16px",
          pointerEvents: "none",
        }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}