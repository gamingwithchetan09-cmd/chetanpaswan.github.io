function PortfolioIcon({ type }) {
  if (type === "video") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="12" y="18" width="30" height="28" rx="8" stroke="currentColor" strokeWidth="3"></rect>
        <path d="M28 28l10 6-10 6V28z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></path>
        <path d="M42 26l10-5v22l-10-5" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></path>
      </svg>
    );
  }

  if (type === "social") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M18 18h28a6 6 0 016 6v16a6 6 0 01-6 6H28l-10 8v-8h0a6 6 0 01-6-6V24a6 6 0 016-6z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></path>
        <path d="M24 29h18M24 36h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 42l12-20 16 6-20 20-8-6z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></path>
      <path d="M30 20l4-8 10 6-4 8" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></path>
      <circle cx="42" cy="26" r="3.5" stroke="currentColor" strokeWidth="3"></circle>
    </svg>
  );
}

function PortfolioGrid() {
  const [lightbox, setLightbox] = React.useState(null);
  const gridRef = React.useRef(null);

  const items = [
    {
      title: "Travel Poster Design",
      tag: "Graphic Design",
      type: "design",
      description: "Poster composition and destination-led art direction for travel promotion.",
      meta: ["Brand layout", "Print-ready", "Visual storytelling"],
      accent: "linear-gradient(135deg, rgba(0,212,255,0.92), rgba(124,58,237,0.92))",
      accentSoft: "rgba(0, 212, 255, 0.2)",
    },
    {
      title: "Social Media Campaign",
      tag: "Social Media",
      type: "social",
      description: "Campaign-ready post concepts designed to keep visuals consistent across fast-moving channels.",
      meta: ["Campaign support", "Content rhythm", "Audience cues"],
      accent: "linear-gradient(135deg, rgba(244,114,182,0.92), rgba(251,191,36,0.92))",
      accentSoft: "rgba(244, 114, 182, 0.2)",
    },
    {
      title: "Promotional Reel",
      tag: "Video Editing",
      type: "video",
      description: "Short-form reel styling with stronger pacing, structure, and a polished promotional finish.",
      meta: ["Reel edit", "Pacing", "Promotional cut"],
      accent: "linear-gradient(135deg, rgba(34,211,238,0.9), rgba(244,114,182,0.92))",
      accentSoft: "rgba(34, 211, 238, 0.18)",
    },
    {
      title: "Brand Identity Kit",
      tag: "Graphic Design",
      type: "design",
      description: "Identity-focused layout direction for consistent logos, colors, and presentation pieces.",
      meta: ["Logo use", "Visual system", "Brand consistency"],
      accent: "linear-gradient(135deg, rgba(251,191,36,0.92), rgba(0,212,255,0.86))",
      accentSoft: "rgba(251, 191, 36, 0.16)",
    },
    {
      title: "Instagram Content",
      tag: "Social Media",
      type: "social",
      description: "Social-ready content blocks that support regular posting while keeping the look premium.",
      meta: ["Feed structure", "Story assets", "Quick turnarounds"],
      accent: "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(0,212,255,0.86))",
      accentSoft: "rgba(124, 58, 237, 0.18)",
    },
    {
      title: "Event Highlights Video",
      tag: "Video Editing",
      type: "video",
      description: "Highlight-focused edits that keep pace, emphasis, and replay value balanced.",
      meta: ["Highlights", "Motion rhythm", "Event recap"],
      accent: "linear-gradient(135deg, rgba(244,114,182,0.92), rgba(124,58,237,0.92))",
      accentSoft: "rgba(244, 114, 182, 0.18)",
    },
  ];

  React.useEffect(() => {
    if (!lightbox) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightbox]);

  React.useEffect(() => {
    if (!gridRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (!supportsHover) return undefined;

    const cards = Array.from(gridRef.current.querySelectorAll("[data-tilt]"));
    const listeners = [];

    cards.forEach((card) => {
      const strength = Number(card.dataset.tiltStrength || 12);

      const onMove = (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const rotateY = (x - 0.5) * strength;
        const rotateX = (0.5 - y) * strength;
        card.style.transform =
          `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      };

      const onLeave = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      listeners.push([card, onMove, onLeave]);
    });

    return () => {
      listeners.forEach(([card, onMove, onLeave]) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <React.Fragment>
      <div className="portfolio-grid" ref={gridRef}>
        {items.map((item, index) => (
          <article
            className="surface portfolio-item"
            key={item.title}
            data-tilt
            data-tilt-strength="12"
            onClick={() => setLightbox(item)}
            role="button"
            tabIndex="0"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setLightbox(item);
              }
            }}
            aria-label={`Open ${item.title}`}
          >
            <div className="portfolio-item__inner">
              <div className="portfolio-item__visual" style={{ background: item.accent }}>
                <span className="portfolio-item__gradient" style={{ background: item.accent }}></span>
                <span className="portfolio-item__orb" style={{ boxShadow: `0 0 48px ${item.accentSoft}` }}></span>
                <span className="portfolio-item__mesh"></span>
              </div>

              <div className="portfolio-item__icon">
                <PortfolioIcon type={item.type} />
              </div>

              <div className="portfolio-item__content">
                <span className="portfolio-item__tag">{item.tag}</span>
                <h2 className="portfolio-item__title">{item.title}</h2>
                <p className="portfolio-item__desc">{item.description}</p>
                <div className="portfolio-item__meta">
                  {item.meta.map((entry) => (
                    <span key={entry}>{entry}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={`lightbox ${lightbox ? "active" : ""}`} onClick={() => setLightbox(null)}>
        {lightbox && (
          <div className="lightbox__panel" onClick={(event) => event.stopPropagation()}>
            <div className="lightbox__panel-inner">
              <div className="lightbox__header">
                <div>
                  <p className="eyebrow">Portfolio spotlight</p>
                  <h2 className="lightbox__title">{lightbox.title}</h2>
                </div>

                <button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close project preview">
                  Close
                </button>
              </div>

              <div className="lightbox__visual" style={{ background: lightbox.accent }}>
                <div className="portfolio-item__visual">
                  <span className="portfolio-item__gradient" style={{ background: lightbox.accent }}></span>
                  <span className="portfolio-item__orb" style={{ boxShadow: `0 0 48px ${lightbox.accentSoft}` }}></span>
                  <span className="portfolio-item__mesh"></span>
                </div>
                <div className="portfolio-item__icon">
                  <PortfolioIcon type={lightbox.type} />
                </div>
              </div>

              <div className="lightbox__copy">
                <p>{lightbox.description}</p>
                <div className="lightbox__meta">
                  <span>{lightbox.tag}</span>
                  {lightbox.meta.map((entry) => (
                    <span key={entry}>{entry}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

window.PortfolioGrid = PortfolioGrid;
