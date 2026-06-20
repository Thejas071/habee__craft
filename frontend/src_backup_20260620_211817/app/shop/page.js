import Link from "next/link";
import { getProducts } from "../../services/productService";
import SearchBar from "../../components/SearchBar";
import SortDropdown from "../../components/SortDropdown";
import styles from "./shop.module.css";
import ProductCard from "../../components/ProductCard";

export default async function Shop({ searchParams }) {
  const params = await searchParams;

  const search = params?.search || "";
  const sort = params?.sort || "newest";

  const products = await getProducts(search, sort);

  return (
    <main className={styles.shopContainer}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>Our Collection</h1>
        <p className={styles.subtitle}>Explore our range of unique handcrafted creations and beautiful bouquets.</p>
      </section>

      <section className={styles.shopContent}>
        {/* Search & Sort Filters Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <SearchBar />
          </div>
          <div className={styles.sortWrapper}>
            <SortDropdown />
          </div>
        </div>

        {/* Results Summary */}
        {search && (
          <p className={styles.resultsText}>
            Showing results for “<strong>{search}</strong> ({products.length} {products.length === 1 ? 'product' : 'products'} found)
          </p>
        )}

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {products.length === 0 ? (
            <div className={styles.noProducts}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <h2 className={styles.noProductsTitle}>No products found</h2>
              <p>Try searching for a different keyword or check back later!</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}