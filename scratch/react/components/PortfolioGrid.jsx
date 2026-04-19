/* PortfolioGrid — Responsive grid with lightbox */
function PortfolioGrid() {
  const [lightbox, setLightbox] = React.useState(null);

  const items = [
    { title: 'Travel Poster Design', tag: 'Graphic Design', gradient: 'linear-gradient(135deg, #6c63ff 0%, #f472b6 100%)' },
    { title: 'Social Media Campaign', tag: 'Social Media', gradient: 'linear-gradient(135deg, #06b6d4 0%, #6c63ff 100%)' },
    { title: 'Promotional Reel', tag: 'Video Editing', gradient: 'linear-gradient(135deg, #f472b6 0%, #fbbf24 100%)' },
    { title: 'Brand Identity Kit', tag: 'Graphic Design', gradient: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)' },
    { title: 'Instagram Content', tag: 'Social Media', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)' },
    { title: 'Event Highlights Video', tag: 'Video Editing', gradient: 'linear-gradient(135deg, #a78bfa 0%, #6c63ff 100%)' },
  ];

  return (
    <React.Fragment>
      <div className="portfolio-grid">
        {items.map((item, i) => (
          <div className="portfolio-item" key={i} onClick={() => setLightbox(item)}>
            <div
              style={{ width: '100%', height: '100%', background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>
                {item.tag === 'Graphic Design' ? '🎨' : item.tag === 'Video Editing' ? '🎬' : '📱'}
              </span>
            </div>
            <div className="portfolio-item__overlay">
              <p className="portfolio-item__tag">{item.tag}</p>
              <p className="portfolio-item__title">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <div className={`lightbox ${lightbox ? 'active' : ''}`} onClick={() => setLightbox(null)}>
        {lightbox && (
          <React.Fragment>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>×</button>
            <div style={{
              width: '80%', maxWidth: '600px', aspectRatio: '4/3',
              background: lightbox.gradient, borderRadius: '12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}>
              <span style={{ fontSize: '3rem' }}>
                {lightbox.tag === 'Graphic Design' ? '🎨' : lightbox.tag === 'Video Editing' ? '🎬' : '📱'}
              </span>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{lightbox.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{lightbox.tag}</p>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

window.PortfolioGrid = PortfolioGrid;
