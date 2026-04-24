function ReviewsSection({ reviews, status }) {
  if (status === "loading") {
    return (
      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="section__title">Client feedback</h2>
          </div>
          <p className="section__copy">Approved reviews will appear here as soon as the live data finishes loading.</p>
        </div>

        <div className="reviews-grid">
          {[0, 1, 2].map((index) => (
            <div className="surface review-card" key={index} aria-hidden="true">
              <div className="skeleton-stack">
                <div className="skeleton-line skeleton-line--sm"></div>
                <div className="skeleton-line skeleton-line--lg"></div>
                <div className="skeleton-line skeleton-line--lg"></div>
                <div className="skeleton-line skeleton-line--md"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (status === "preview") {
    return (
      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="section__title">Client feedback</h2>
          </div>
          <p className="section__copy">Preview mode is showing the layout without live API data.</p>
        </div>

        <div className="reviews-section__message">
          Reviews load from the live backend. The visual treatment is ready even when the page is opened directly from a
          local file.
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="section__title">Client feedback</h2>
          </div>
          <p className="section__copy">This section stays ready for approved reviews without leaving a blank gap.</p>
        </div>

        <div className="reviews-section__message">
          Approved testimonials will appear here once review data is available.
        </div>
      </section>
    );
  }

  return (
    <section className="reviews-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="section__title">Client feedback</h2>
        </div>
        <p className="section__copy">
          Approved comments from the live API inherit the same glass styling and hierarchy as the rest of the portfolio.
        </p>
      </div>

      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <article className="surface review-card" key={review._id || index}>
            <div className="review-card__kicker">Verified response</div>
            <p className="review-card__quote">{review.message}</p>
            <div className="review-card__footer">
              <p className="review-card__name">{review.name}</p>
              <span className="review-card__rating">{review.rating}/5</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

window.ReviewsSection = ReviewsSection;
