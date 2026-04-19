/* App.jsx — Multi-page React entry, mounts components based on current page */

function mountComponents() {
  // Portfolio page
  const portfolioRoot = document.getElementById('portfolio-root');
  if (portfolioRoot) {
    ReactDOM.createRoot(portfolioRoot).render(React.createElement(window.PortfolioGrid));
  }

  // Contact page
  const contactRoot = document.getElementById('contact-root');
  if (contactRoot) {
    ReactDOM.createRoot(contactRoot).render(React.createElement(window.ContactForm));
  }

  // Reviews — conditional render (on portfolio page)
  const reviewsRoot = document.getElementById('reviews-root');
  if (reviewsRoot && window.API) {
    window.API.fetchReviews().then((reviews) => {
      ReactDOM.createRoot(reviewsRoot).render(
        React.createElement(window.ReviewsSection, { reviews })
      );
    });
  }
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountComponents);
} else {
  mountComponents();
}
