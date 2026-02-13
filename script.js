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
// split title text into per-letter spans for per-letter animation
function splitTitleChars() {
  const el = document.querySelector(".title");
  if (!el) return;
  const text = el.textContent.trim();
  el.innerHTML = "";
  const wrapper = document.createDocumentFragment();
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const span = document.createElement("span");
    span.className = "title-char";
    span.textContent = ch === " " ? "\u00A0" : ch;
    wrapper.appendChild(span);
  }
  el.appendChild(wrapper);
}

splitTitleChars();

// per-letter animation using GSAP (gentle)
function animateTitleChars() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const chars = document.querySelectorAll(".title-char");
  if (!chars.length) return;
  try {
    gsap.to(chars, {
      y: -6,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "sine.inOut",
      stagger: { each: 0.06, from: "center" },
    });
  } catch (e) {
    /* ignore if gsap not present */
  }
}

// call after ensuring gsap loaded (if present)
if (window.gsap) {
  try {
    animateTitleChars();
  } catch (e) {}
} else {
  // if gsap not yet loaded, attempt later
  window.addEventListener("load", () => {
    try {
      animateTitleChars();
    } catch (e) {}
  });
}

// touch support for reason cards: add/remove touch-active class
document.addEventListener("click", function (e) {
  const card = e.target.closest(".reason-card");
  if (card) return; // clicks on cards should not toggle
});
document.querySelectorAll(".reason-card").forEach((card) => {
  card.addEventListener("touchstart", () => card.classList.add("touch-active"));
  card.addEventListener("touchend", () =>
    card.classList.remove("touch-active"),
  );
  card.addEventListener("touchcancel", () =>
    card.classList.remove("touch-active"),
  );
});
// gentle looping title motion
try {
  gsap.to(".title", {
    y: -6,
    repeat: -1,
    yoyo: true,
    duration: 2.4,
    ease: "sine.inOut",
    delay: 1.1,
  });
} catch (e) {}

// reveal reasons list when scrolled into view
const reasons = document.querySelectorAll(".reasons ul li");
if (reasons && reasons.length) {
  try {
    gsap.from(reasons, {
      y: 18,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      scrollTrigger: { trigger: ".reasons", start: "top 85%" },
    });
  } catch (e) {
    gsap.from(reasons, { y: 18, opacity: 0, stagger: 0.12, duration: 0.9 });
  }
}

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
    const rotation = Math.random() * 360; // degrees
    h.style.left = left + "%";
    h.style.top = 110 + Math.random() * 8 + "%";
    h.style.fontSize = size + "px";
    h.style.transform = `rotate(${rotation}deg)`;
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
