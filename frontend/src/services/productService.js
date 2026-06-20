export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://habee-craft.onrender.com";

/**
 * Fetch list of products with optional search and sort.
 * Returns empty array on network errors to avoid breaking UI.
 */
export async function getProducts(search = "", sort = "newest") {
  try {
    const response = await fetch(
      `${API_URL}/products/?search=${search}&sort=${sort}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error("Failed to fetch products", response.status);
      return [];
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

/**
 * Fetch a single product by id.
 * Returns null on error.
 */
export async function getProduct(id) {
  try {
    const response = await fetch(
      `${API_URL}/products/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error("Failed to fetch product", response.status);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}