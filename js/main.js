const API_BASE =
  window.location.protocol === "file:"
    ? "http://localhost:3000/api"
    : window.location.origin + "/api";

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function initPageReady() {
  requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });
}

function initRevealAnimations() {
  const elements = Array.from(document.querySelectorAll("[data-reveal]"));
  elements.forEach((element, index) => {
    if (!element.style.getPropertyValue("--reveal-delay")) {
      const delay = element.dataset.delay ? Number(element.dataset.delay) : (index % 6) * 80;
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    }
  });

  if (!("IntersectionObserver" in window) || motionQuery.matches) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      element.classList.add("visible");
      observer.unobserve(element);
    }
  });

  if (document.body.classList.contains("page-home")) {
    const heroElements = Array.from(document.querySelectorAll(".home__hero [data-reveal]"));
    heroElements.forEach((element, index) => {
      window.setTimeout(() => {
        element.classList.add("visible");
        observer.unobserve(element);
      }, index * 90);
    });
  }
}

function initNav() {
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  if (!nav || !toggle || !links) return;

  const closeNav = () => {
    nav.classList.remove("nav--open");
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    nav.classList.add("nav--open");
    links.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const syncScrolledState = () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 16);
  };

  syncScrolledState();
  window.addEventListener("scroll", syncScrolledState, { passive: true });

  toggle.addEventListener("click", () => {
    if (links.classList.contains("open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
}

async function fetchReviews() {
  if (window.location.protocol === "file:") {
    return [];
  }

  try {
    const response = await fetch(API_BASE + "/reviews");
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function submitContact(formData) {
  const response = await fetch(API_BASE + "/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to submit");
  }

  return response.json();
}

window.API = { fetchReviews, submitContact };

function initRoleRotator() {
  const rotator = document.querySelector("[data-roles]");
  if (!rotator || motionQuery.matches) return;

  const valueNode = rotator.querySelector(".role-rotator__value");
  const roles = (rotator.dataset.roles || "")
    .split("|")
    .map((role) => role.trim())
    .filter(Boolean);

  if (!valueNode || roles.length < 2) return;

  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % roles.length;
    valueNode.style.opacity = "0";
    valueNode.style.transform = "translateY(6px)";

    window.setTimeout(() => {
      valueNode.textContent = roles[index];
      valueNode.style.opacity = "1";
      valueNode.style.transform = "translateY(0)";
    }, 180);
  }, 2500);
}

function initTiltCards() {
  if (motionQuery.matches || !window.matchMedia("(hover: hover)").matches) return;

  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach((card) => {
    const strength = Number(card.dataset.tiltStrength || 12);

    const reset = () => {
      card.style.transform = "";
    };

    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * strength;
      const rotateX = (0.5 - y) * strength;

      card.style.transform =
        `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", reset);
    card.addEventListener("blur", reset, true);
  });
}

function initCursorGlow() {
  if (motionQuery.matches || !window.matchMedia("(hover: hover)").matches) return;

  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    rafId = window.requestAnimationFrame(render);
  };

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });

  render();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      glow.style.opacity = "0";
    } else if (!rafId) {
      render();
    }
  });
}

function initThreeBackground() {
  if (motionQuery.matches || typeof THREE === "undefined") return;

  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const root = new THREE.Group();
  scene.add(root);
  root.scale.setScalar(0.92);

  const wireGeometry = new THREE.IcosahedronGeometry(1.65, 1);
  const wireMesh = new THREE.Mesh(
    wireGeometry,
    new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
  );
  root.add(wireMesh);

  const edgeLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.95, 0)),
    new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.58,
    })
  );
  root.add(edgeLines);

  const coreMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.78, 1),
    new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
  );
  root.add(coreMesh);

  const rings = new THREE.Group();
  const ringConfigs = [
    { size: 2.5, color: 0x00d4ff, rotationX: Math.PI / 2.8, rotationY: 0.4 },
    { size: 2.95, color: 0xf472b6, rotationX: 0.9, rotationY: Math.PI / 2.6 },
    { size: 3.35, color: 0xfbbf24, rotationX: 0.4, rotationY: Math.PI / 2.1 },
  ];

  ringConfigs.forEach((config, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(config.size, 0.012, 12, 96),
      new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.08 + index * 0.02,
      })
    );
    ring.rotation.x = config.rotationX;
    ring.rotation.y = config.rotationY;
    rings.add(ring);
  });
  scene.add(rings);

  const particleCount = 720;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleBase = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const i = index * 3;
    const radius = 2.4 + Math.random() * 5.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particleBase[i] = radius * Math.sin(phi) * Math.cos(theta);
    particleBase[i + 1] = radius * Math.cos(phi);
    particleBase[i + 2] = radius * Math.sin(phi) * Math.sin(theta);

    particlePositions[i] = particleBase[i];
    particlePositions[i + 1] = particleBase[i + 1];
    particlePositions[i + 2] = particleBase[i + 2];
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xc7f6ff,
      size: 0.028,
      transparent: true,
      opacity: 0.62,
      sizeAttenuation: true,
    })
  );
  scene.add(particles);

  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0.18, y: 0.2 };
  const baseOffset = { x: window.innerWidth > 900 ? 1.1 : 0.45, y: window.innerWidth > 900 ? -0.15 : -0.55 };
  let animationFrame = 0;
  let active = true;

  root.position.set(baseOffset.x, baseOffset.y, 0);
  rings.position.set(baseOffset.x * 0.55, baseOffset.y * 0.55, 0);

  function updateSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    baseOffset.x = window.innerWidth > 900 ? 1.1 : 0.45;
    baseOffset.y = window.innerWidth > 900 ? -0.15 : -0.55;
  }

  function animate(time) {
    if (!active) return;

    const elapsed = time * 0.001;
    targetRotation.x = 0.18 + mouse.y * 0.28;
    targetRotation.y = 0.2 + mouse.x * 0.42;

    root.rotation.x += (targetRotation.x - root.rotation.x) * 0.045;
    root.rotation.y += (targetRotation.y - root.rotation.y) * 0.045;
    root.rotation.z += 0.0016;
    root.position.x += (baseOffset.x + mouse.x * 0.3 - root.position.x) * 0.045;
    root.position.y += (baseOffset.y - mouse.y * 0.16 - root.position.y) * 0.045;

    coreMesh.rotation.x -= 0.0022;
    coreMesh.rotation.y += 0.0028;
    wireMesh.rotation.y -= 0.0014;
    edgeLines.rotation.x += 0.0012;

    rings.rotation.x += 0.0008;
    rings.rotation.y -= 0.0011;
    rings.position.x += (baseOffset.x * 0.55 - rings.position.x) * 0.04;
    rings.position.y += (baseOffset.y * 0.55 - rings.position.y) * 0.04;

    const positionAttribute = particleGeometry.attributes.position;
    for (let index = 0; index < particleCount; index += 1) {
      const i = index * 3;
      const offset = Math.sin(elapsed * 0.85 + index * 0.17) * 0.09;
      positionAttribute.array[i] = particleBase[i] + offset;
      positionAttribute.array[i + 1] = particleBase[i + 1] + Math.cos(elapsed * 0.72 + index * 0.13) * 0.1;
      positionAttribute.array[i + 2] = particleBase[i + 2] + Math.sin(elapsed * 0.62 + index * 0.11) * 0.08;
    }
    positionAttribute.needsUpdate = true;

    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(animate);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      mouse.x = event.clientX / window.innerWidth - 0.5;
      mouse.y = event.clientY / window.innerHeight - 0.5;
    },
    { passive: true }
  );

  window.addEventListener("resize", updateSize);

  document.addEventListener("visibilitychange", () => {
    active = !document.hidden;

    if (!active) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = window.requestAnimationFrame(animate);
    }
  });

  animationFrame = window.requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  initPageReady();
  initRevealAnimations();
  initNav();
  initRoleRotator();
  initTiltCards();
  initCursorGlow();
  initThreeBackground();
});
