function mountComponents() {
  const portfolioRoot = document.getElementById("portfolio-root");
  if (portfolioRoot) {
    ReactDOM.createRoot(portfolioRoot).render(React.createElement(window.PortfolioGrid));
  }

  const contactRoot = document.getElementById("contact-root");
  if (contactRoot) {
    ReactDOM.createRoot(contactRoot).render(React.createElement(window.ContactForm));
  }

  const reviewsRoot = document.getElementById("reviews-root");
  if (reviewsRoot) {
    const reviewsApp = ReactDOM.createRoot(reviewsRoot);

    if (window.location.protocol === "file:" || !window.API) {
      reviewsApp.render(
        React.createElement(window.ReviewsSection, {
          reviews: [],
          status: "preview",
        })
      );
      return;
    }

    reviewsApp.render(
      React.createElement(window.ReviewsSection, {
        reviews: [],
        status: "loading",
      })
    );

    window.API.fetchReviews().then((reviews) => {
      reviewsApp.render(
        React.createElement(window.ReviewsSection, {
          reviews,
          status: reviews.length ? "loaded" : "empty",
        })
      );
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountComponents);
} else {
  mountComponents();
}
