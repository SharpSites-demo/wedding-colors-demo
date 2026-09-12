/* Wedding Colors — app.js
 * Canvas UI "Liquid" (vanilla WebGL build, DavidHDev/canvas-ui, MIT)
 * — pointer-driven fluid over the hero collage when the browser supports
 *   the html-in-canvas API; the site degrades to the plain collage otherwise.
 */
import { createLiquid, supportsHtmlInCanvas } from "./components/canvasui/LiquidVanilla.js";

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  function showAll() {
    reveals.forEach((el) => el.classList.add("in"));
  }

  if (reduced) {
    showAll();
  } else if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".reveal", {
      opacity: 0,
      y: 16,
      duration: 0.7,
      stagger: 0.06,
      ease: "power2.out",
      scrollTrigger: { trigger: ".sec-styles", start: "top 85%", once: true },
    });
    reveals.forEach((el) => el.classList.add("in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    showAll();
  }

  const source = document.getElementById("wcSource");
  const content = document.getElementById("wcFallback");
  const output = document.getElementById("wcOutput");
  if (!source || !content || !output) return;
  if (reduced || !supportsHtmlInCanvas()) return;

  let instance = null;
  try {
    instance = createLiquid(
      { source, content, output },
      {
        color: [0.847, 0.216, 0.424],
        intensity: 0.9,
        distortion: 1.6,
        blend: 26,
        densityDissipation: 0.965,
        radius: 0.32,
        force: 0.92,
      }
    );
  } catch (err) {
    instance = null;
  }
  if (!instance) return;
  source.style.display = "block";
  output.classList.add("live");
  content.setAttribute("aria-hidden", "true");
})();
