// Lumina: the booking form, smooth scroll, and one scroll-scrubbed moment (the
// passage from cold to heat). Motion is an enhancement: without JS, or with
// reduced motion, every page reads as plain content.

// ---------- Booking (runs with or without motion) ----------
(() => {
  const form = document.querySelector(".booking-form");
  if (!form) return;

  const sessions = form.querySelectorAll('input[name="session"]');
  const slots = form.querySelectorAll('input[name="time"]');
  const date = form.querySelector("#date");
  const guests = form.querySelector("#guests");
  const summary = document.querySelector("[data-summary]");
  const total = document.querySelector("[data-total]");
  const error = form.querySelector("[data-error]");
  const kr = new Intl.NumberFormat("en-DK");
  const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });

  // No booking in the past. Local date, not UTC, so late evening still means today.
  const now = new Date();
  date.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const chosen = (name) => form.querySelector(`input[name="${name}"]:checked`);

  // Each session only has the slots it runs in: morning at 07:00, private in the evening.
  function syncSlots() {
    const session = chosen("session")?.value;
    slots.forEach((slot) => {
      const allowed = !session || slot.dataset.for.split(" ").includes(session);
      slot.disabled = !allowed;
      if (!allowed) slot.checked = false;
    });
  }

  function update() {
    const session = chosen("session");
    const time = chosen("time");
    const count = Number(guests.value);
    const price = session ? Number(session.dataset.price) : 0;
    total.textContent = kr.format("flat" in (session?.dataset ?? {}) ? price : price * count);

    const parts = [];
    if (session) parts.push(session.closest("label").querySelector(".choice-name").textContent);
    if (date.value) parts.push(dayFormat.format(new Date(`${date.value}T12:00`)));
    if (time) parts.push(time.value);
    parts.push(`${count} ${count === 1 ? "guest" : "guests"}`);
    summary.textContent = session ? parts.join(" · ") : "Choose a session, a day and a time.";
  }

  form.addEventListener("change", (event) => {
    if (event.target.name === "session") syncSlots();
    event.target.removeAttribute("aria-invalid");
    update();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const missing = [];
    if (!chosen("session")) missing.push("a session");
    if (!date.value || date.value < date.min) missing.push("a day from today on");
    if (!chosen("time")) missing.push("a time");
    for (const field of form.querySelectorAll("#name, #email")) {
      const ok = field.checkValidity() && field.value.trim();
      field.setAttribute("aria-invalid", String(!ok));
      if (!ok) missing.push(field.id === "email" ? "a valid email" : "your name");
    }
    date.setAttribute("aria-invalid", String(!date.value || date.value < date.min));

    if (missing.length) {
      error.textContent = `Almost there. Please add ${missing.join(", ")}.`;
      error.hidden = false;
      return;
    }

    const confirmation = document.querySelector("[data-confirmation]");
    const name = form.querySelector("#name").value.trim().split(" ")[0];
    confirmation.querySelector("[data-confirmation-title]").textContent = `Thank you, ${name}.`;
    confirmation.querySelector("[data-confirmation-text]").textContent =
      `${summary.textContent}, ${total.textContent} kr.`;
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.querySelector("[data-confirmation-title]").focus();
  });

  syncSlots();
  update();
})();

// ---------- Motion ----------
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion");
  const has = (selector) => document.querySelector(selector) !== null;

  // Lenis owns the scroll; ScrollTrigger reads the same position on every frame.
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Same-page links glide too. The skip link keeps the native jump, so focus moves with it.
    document.querySelectorAll('a[href^="#"]:not(.skip)').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { duration: 1.6 });
      });
    });
  }

  // Hero: the photo sinks a little slower than the page, the type lifts away.
  if (has(".hero-media")) {
    gsap.to(".hero-media", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }
  if (has(".hero-inner")) {
    gsap.to(".hero-inner", {
      opacity: 0,
      y: -60,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true },
    });
  }

  // Headings come into focus as they arrive, the same way the steam clears.
  gsap.utils.toArray(".intro-title, .rest-title, [data-reveal]").forEach((heading) => {
    gsap.from(heading, {
      opacity: 0,
      y: 30,
      filter: "blur(10px)",
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });
  });

  // Room photos settle into their frames.
  gsap.utils.toArray(".room-media img, .band img").forEach((image) => {
    gsap.fromTo(
      image,
      { scale: 1.15 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: image.closest("picture, figure"), start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  // Webfonts change line heights, so measure again once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  if (!has(".passage")) return;

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

})();
