"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "../../../services/productService";

export default function AdminLogin() {
  const router = useRouter();
  
  // Modes: 'login', 'forgot', 'reset'
  const [mode, setMode] = useState("login");
  
  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Forgot Password State
  const [recoveryCode, setRecoveryCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_token")) router.push("/admin/dashboard");
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid credentials");
      localStorage.setItem("admin_token", data.access_token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRecovery = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-recovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recovery_code: recoveryCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid recovery code");
      setResetToken(data.reset_token);
      setMode("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reset password");
      setSuccess("Password updated successfully. You can now sign in.");
      setMode("login");
      setPassword("");
      setRecoveryCode("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid #e0dbd8", borderRadius: 8,
    fontSize: "0.9rem", fontFamily: "inherit",
    background: "#fff", color: "#1a1614", outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f2e8e5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff", borderRadius: 18,
        padding: "44px 40px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #ede8e5",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/logo.png" alt="Habee Craft Logo" style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 14, display: "block", margin: "0 auto" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.55rem", fontWeight: 600, color: "#1a1614", letterSpacing: "-0.02em", marginBottom: 6 }}>
            Habee Craft
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#7a7270" }}>
            {mode === "login" ? "Sign in to manage your store" : mode === "forgot" ? "Enter your recovery code" : "Create a new password"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ background: "#fdecea", color: "#c0392b", border: "1px solid rgba(192,57,43,0.2)", padding: "10px 14px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 18 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#e8f5e9", color: "#2e7d32", border: "1px solid rgba(46,125,50,0.2)", padding: "10px 14px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 18 }}>
            {success}
          </div>
        )}

        {/* Forms based on mode */}
        {mode === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a1614", letterSpacing: "0.03em" }}>USERNAME</label>
              <input
                type="text" value={username} placeholder="admin" required
                onChange={e => setUsername(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#c9366b"}
                onBlur={e => e.target.style.borderColor = "#e0dbd8"}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a1614", letterSpacing: "0.03em" }}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password} placeholder="••••••••" required
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 42 }}
                  onFocus={e => e.target.style.borderColor = "#c9366b"}
                  onBlur={e => e.target.style.borderColor = "#e0dbd8"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#b0aaa8", padding: 2,
                }}>
                  {showPass
                    ? <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div style={{ textAlign: "right", marginTop: 2 }}>
                <button type="button" onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#c9366b", fontSize: "0.8rem", cursor: "pointer", padding: 0 }}>
                  Forgot Password?
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "11px",
              background: loading ? "#e8d0d8" : "#c9366b",
              border: "1.5px solid #c9366b",
              borderRadius: 8, color: "#fff",
              fontWeight: 600, fontSize: "0.9rem",
              fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.18s",
            }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleVerifyRecovery} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a1614", letterSpacing: "0.03em" }}>RECOVERY CODE</label>
              <input
                type="text" value={recoveryCode} placeholder="Enter your 16-character code" required
                onChange={e => setRecoveryCode(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#c9366b"}
                onBlur={e => e.target.style.borderColor = "#e0dbd8"}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "11px",
              background: loading ? "#e8d0d8" : "#c9366b",
              border: "1.5px solid #c9366b",
              borderRadius: 8, color: "#fff",
              fontWeight: 600, fontSize: "0.9rem",
              fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.18s",
            }}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#b0aaa8", fontSize: "0.8rem", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a1614", letterSpacing: "0.03em" }}>NEW PASSWORD</label>
              <input
                type="password" value={newPassword} placeholder="••••••••" required
                onChange={e => setNewPassword(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#c9366b"}
                onBlur={e => e.target.style.borderColor = "#e0dbd8"}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a1614", letterSpacing: "0.03em" }}>CONFIRM PASSWORD</label>
              <input
                type="password" value={confirmPassword} placeholder="••••••••" required
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#c9366b"}
                onBlur={e => e.target.style.borderColor = "#e0dbd8"}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "11px",
              background: loading ? "#e8d0d8" : "#c9366b",
              border: "1.5px solid #c9366b",
              borderRadius: 8, color: "#fff",
              fontWeight: 600, fontSize: "0.9rem",
              fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.18s",
            }}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: 22 }}>
          <Link href="/" style={{ fontSize: "0.8rem", color: "#b0aaa8" }}>← Back to Store</Link>
        </div>
      </div>
    </div>
  );
}
