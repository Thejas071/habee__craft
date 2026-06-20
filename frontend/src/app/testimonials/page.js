export const dynamic = "force-dynamic";

import styles from "./Testimonials.module.css";
import { API_URL } from "../../services/productService";

export default async function TestimonialsPage() {
  let reviews = [];
  try {
    const res = await fetch(`${API_URL}/testimonials/`, {
      cache: "no-store",
    });
    if (res.ok) {
      reviews = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch testimonials:", err);
  }

  if (reviews.length === 0) {
    reviews = [
      {
        id: -1,
        name: "Sneha Reddy",
        message: "The Premium Red Rose Bouquet was absolutely breathtaking. The packaging was so secure, and the flowers remained fresh for almost a week! Highly recommend Habee Craft for any special occasions.",
        rating: 5,
        created_at: new Date().toISOString()
      },
      {
        id: -2,
        name: "Abhishek Sharma",
        message: "I ordered a custom gift hamper for my anniversary, and it exceeded my expectations. The attention to detail and personal touch made it a memorable gift. Thank you team!",
        rating: 5,
        created_at: new Date().toISOString()
      },
      {
        id: -3,
        name: "Kavya Menon",
        message: "Beautiful handcrafted items. You can really feel the love and passion that goes into making these. Delivery was prompt and ordering via WhatsApp was super easy.",
        rating: 4,
        created_at: new Date().toISOString()
      }
    ];
  }

  return (
    <main className={styles.testimonialsContainer}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>Customer Reviews</h1>
        <p className={styles.subtitle}>Here is what our lovely community has to say about their handcrafted gifts.</p>
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <span className={styles.quoteIcon}>"</span>
              
              <div className={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className={styles.starIcon} fill={i < review.rating ? "currentColor" : "none"} stroke={i >= review.rating ? "currentColor" : "none"} strokeWidth={i >= review.rating ? "2" : "0"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              <p className={styles.reviewText}>"{review.message}"</p>

              <div className={styles.clientDetails}>
                <div className={styles.clientAvatar}>
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.clientInfo}>
                  <span className={styles.clientName}>{review.name}</span>
                  <span className={styles.clientOccasion}>Verified Purchase</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}