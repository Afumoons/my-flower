// Smooth scroll for internal links
document.addEventListener("click", function (e) {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    const href = a.getAttribute("href");
    if (href.length > 1) {
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
});

// Tiny heart spawn on primary button clicks
function spawnHeart(x, y) {
  const h = document.createElement("div");
  h.className = "floating-heart";
  h.style.left = x + "px";
  h.style.top = y + "px";
  h.style.background =
    "radial-gradient(circle at 30% 30%, #fff, var(--accent))";
  h.style.borderRadius = "6px 6px 6px 6px";
  h.style.width = "18px";
  h.style.height = "18px";
  h.style.transform = "translate(-50%,0) rotate(45deg)";
  h.style.clipPath =
    "polygon(50% 0%, 100% 40%, 80% 100%, 50% 80%, 20% 100%, 0% 40%)";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1400);
}

document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const rect = btn.getBoundingClientRect();
    spawnHeart(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2 + window.scrollY,
    );
  });
});
// GSAP animations (if available)
document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    try {
      gsap.registerPlugin(window.ScrollTrigger);
    } catch (e) {}

    gsap.from(".title", {
      y: -30,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
    });
    gsap.from(".subtitle", {
      y: 10,
      opacity: 0,
      duration: 0.9,
      delay: 0.12,
      ease: "power3.out",
    });
    gsap.from(".hero-decor", {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      delay: 0.18,
      ease: "elastic.out(1,0.6)",
    });

    // gallery reveal on scroll (uses ScrollTrigger when available)
    const photos = document.querySelectorAll(".photo");
    if (photos.length) {
      if (gsap && gsap.utils && gsap.utils.toArray) {
        gsap.from(photos, {
          y: 24,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          scrollTrigger: { trigger: ".gallery", start: "top 80%" },
        });
      } else {
        // fallback stagger on load
        gsap.from(photos, { y: 24, opacity: 0, stagger: 0.12, duration: 0.9 });
      }
    }
  }
});

// Background hearts: spawn subtle floating hearts across the viewport
let _bgIntervalId = null;
function startBgHearts(opts = { interval: 700, max: 120 }) {
  const root = document.getElementById("bg-hearts");
  if (!root) return;
  const interval = opts.interval || 700;
  const max = opts.max || 120;
  let spawned = 0;
  _bgIntervalId = setInterval(() => {
    if (spawned++ > max) return;
    const h = document.createElement("div");
    h.className = "bg-heart";
    h.textContent = "❤";
    const left = Math.random() * 100; // percent
    const size = 10 + Math.random() * 36; // px
    const dur = 8 + Math.random() * 12; // seconds
    const dx = Math.round(Math.random() * 60 - 30) + "px";
    h.style.left = left + "%";
    h.style.top = 110 + Math.random() * 8 + "%";
    h.style.fontSize = size + "px";
    h.style.setProperty("--dur", dur + "s");
    h.style.setProperty("--dx", dx);
    root.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }, interval);
  // stop spawning after a while to avoid unbounded growth
  setTimeout(() => {
    clearInterval(_bgIntervalId);
    _bgIntervalId = null;
  }, opts.durationMs || 45000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (
    !window.matchMedia ||
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    try {
      startBgHearts({ interval: 700, max: 120 });
    } catch (e) {}
  }
});
