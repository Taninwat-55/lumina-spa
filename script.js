// Lumina: smooth scroll and one scroll-scrubbed moment, the passage from cold
// to heat. Everything here is an enhancement: without JS, or with reduced
// motion, the page shows the warm room and both lines as plain content.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion");

  // Lenis owns the scroll; ScrollTrigger reads the same position on every frame.
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // In-page links glide too. The skip link keeps the native jump, so focus moves with it.
    document.querySelectorAll('a[href^="#"]:not(.skip)').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { duration: 1.6 });
      });
    });
  }

  // Hero: the harbour sinks a little slower than the page, the type lifts away.
  gsap.to(".hero-media", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-inner", {
    opacity: 0,
    y: -60,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true },
  });

  // Headings come into focus as they arrive, the same way the steam clears.
  gsap.utils.toArray(".intro-title, .rest-title").forEach((heading) => {
    gsap.from(heading, {
      opacity: 0,
      y: 30,
      filter: "blur(10px)",
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });
  });

  // The passage. Timeline positions are fractions of the scroll track:
  // 0–0.2 cold holds, 0.2–0.65 the heat rises, 0.6–0.85 the warm line focuses, then it holds.
  const tempValue = document.querySelector(".temp-value");
  const heat = { degrees: 9 };

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".passage", start: "top top", end: "bottom bottom", scrub: 0.6 },
    })
    .to(".passage-cold img", { scale: 1.12, duration: 0.5 }, 0)
    .fromTo(".step-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.45 }, 0.2)
    .to(".step-cold", { opacity: 0.45, duration: 0.2 }, 0.25)
    .fromTo(".step-heat", { opacity: 0.45 }, { opacity: 1, duration: 0.2 }, 0.45)
    .to(".line-cold", { opacity: 0, y: -20, filter: "blur(14px)", duration: 0.18 }, 0.22)
    .to(
      heat,
      {
        degrees: 85,
        duration: 0.45,
        ease: "power1.in",
        onUpdate: () => {
          tempValue.textContent = Math.round(heat.degrees);
        },
      },
      0.2,
    )
    .to(".temp", { color: "#f0b48a", duration: 0.45 }, 0.2)
    .to(".passage-stage", { backgroundColor: "#3a1a10", duration: 0.45 }, 0.2)
    // Steam rises first and hides the swap: the water is gone before the wood shows through.
    .to(".steam", { opacity: 1, duration: 0.14 }, 0.24)
    .fromTo(".steam", { yPercent: 35 }, { yPercent: -20, duration: 0.6 }, 0.24)
    .to(".passage-cold", { opacity: 0, duration: 0.14 }, 0.3)
    .fromTo(".passage-warm", { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.4)
    .to(".steam", { opacity: 0.3, duration: 0.2 }, 0.62)
    .fromTo(
      ".line-warm",
      { opacity: 0, y: 30, filter: "blur(18px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.25 },
      0.6,
    )
    .to({}, { duration: 0.15 }, 0.85);

  // Webfonts change line heights, so measure again once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
