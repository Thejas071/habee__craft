import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Habee Craft | Handmade Gifts & Bouquets",
  description: "Beautiful handcrafted gifts, premium flower bouquets, and custom creations for every occasion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <div style={{ flex: "1 0 auto" }}>{children}</div>
          <CartDrawer />
          <footer style={{
            background: "#ffffff",
            borderTop: "1px solid #ede8e5",
            padding: "28px 48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: "0.8rem",
            color: "#b0aaa8",
          }}>
            <span>© {new Date().getFullYear()} Habee Craft. All rights reserved.</span>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}