/* ReviewsSection — Conditional: only renders if reviews exist */
function ReviewsSection({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section className="reviews-section section--alt" id="reviews">
      <div className="container">
        <h2 className="section__title">Reviews</h2>
        <div className="reviews-grid">
          {reviews.map((review, i) => (
            <div className="review-card" key={review._id || i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="review-card__stars">{renderStars(review.rating)}</div>
              <p className="review-card__message">"{review.message}"</p>
              <p className="review-card__name">— {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.ReviewsSection = ReviewsSection;
