/* ============================================
   LUMINA SPA – Scroll journey animations
   GSAP + ScrollTrigger + Lenis
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// ---------- Lenis smooth scroll ----------
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ---------- Custom cursor ----------
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
});

gsap.ticker.add(() => {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  gsap.set(follower, { x: followerX, y: followerY });
});

// ---------- Preloader ----------
const preloader = document.getElementById('preloader');
const progressBar = document.querySelector('.preloader-progress');
const preloaderLogo = document.querySelector('.preloader-logo');

const preTl = gsap.timeline();
preTl
  .to(preloaderLogo, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
  .to(progressBar, { width: '100%', duration: 1.4, ease: 'power2.inOut' }, '-=0.3')
  .to(preloader, {
    opacity: 0,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete: () => {
      preloader.classList.add('done');
      initPageAnimations();
    }
  }, '+=0.2');

// ---------- Mobile menu ----------
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
navToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    if (self.direction === 1 && self.scroll() > 80) {
      nav.classList.add('scrolled');
    } else if (self.scroll() < 80) {
      nav.classList.remove('scrolled');
    }
  }
});

// ---------- Main page animations ----------
function initPageAnimations() {
  // Hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8 })
    .from('.hero-title .line', {
      y: 80,
      opacity: 0,
      duration: 1.1,
      stagger: 0.15
    }, '-=0.4')
    .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
    .from('.scroll-hint', { opacity: 0, y: 15, duration: 0.7 }, '-=0.3');

  // Floating elements continuous
  gsap.to('.petal-1', { y: -25, rotation: 12, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.petal-2', { y: -35, rotation: -10, duration: 7.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  gsap.to('.petal-3', { y: -20, rotation: 8, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });

  // Arrival parallax
  gsap.to('.arrival-image', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.arrival',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.from('.arrival-text .section-title', {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: '.arrival-text',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });
  gsap.from('.arrival-text .section-body', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.15,
    scrollTrigger: {
      trigger: '.arrival-text',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  // Oils section – cards stagger in
  gsap.from('.oil-card', {
    opacity: 0,
    y: 60,
    scale: 0.92,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.oils-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Hands – shapes and waves
  const handsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hands',
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1
    }
  });
  handsTl
    .from('.left-hand', { x: -80, opacity: 0, duration: 1 }, 0)
    .from('.right-hand', { x: 80, opacity: 0, duration: 1 }, 0)
    .to('.wave-1', { opacity: 0.6, scale: 1.1, duration: 0.8 }, 0.3)
    .to('.wave-2', { opacity: 0.4, scale: 1.15, duration: 0.8 }, 0.5)
    .to('.wave-3', { opacity: 0.25, scale: 1.2, duration: 0.8 }, 0.7);

  gsap.from('.hands-text .section-title, .hands-text .section-body, .hands-text .layer-label', {
    opacity: 0,
    y: 40,
    duration: 0.9,
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.hands-text',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  // Stones – appear and glow
  gsap.from('.stone', {
    opacity: 0,
    scale: 0.6,
    y: 40,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.stones-visual',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });
  gsap.to('.glow', {
    opacity: 0.9,
    scale: 1.2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    scrollTrigger: {
      trigger: '.stones',
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    }
  });
  gsap.from('.stones-text .section-title, .stones-text .section-body, .stones-text .layer-label', {
    opacity: 0,
    y: 40,
    duration: 0.9,
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.stones-text',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  // Water ripples
  const waterTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.water',
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  });
  waterTl
    .to('.r1', { opacity: 0.5, scale: 1.3, duration: 1.4, ease: 'power1.out' }, 0)
    .to('.r2', { opacity: 0.35, scale: 1.4, duration: 1.6, ease: 'power1.out' }, 0.2)
    .to('.r3', { opacity: 0.2, scale: 1.5, duration: 1.8, ease: 'power1.out' }, 0.4);

  gsap.from('.water-text .section-title, .water-text .section-body, .water-text .layer-label', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.water-text',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  // Rituals cards
  gsap.from('.ritual-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.rituals-track',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Experience benefits – sequential reveal with scroll
  const benefits = gsap.utils.toArray('.benefit');
  benefits.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: '.experience',
      start: () => `top+=${i * 18}% top`,
      end: () => `top+=${(i + 1) * 18}% top`,
      onEnter: () => el.classList.add('active'),
      onLeaveBack: () => el.classList.remove('active'),
      onEnterBack: () => el.classList.add('active')
    });
  });

  // Voices
  gsap.from('.voice', {
    opacity: 0,
    y: 40,
    duration: 0.85,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.voice-cards',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Book form
  gsap.from('.book-content > *', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.book',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  });

  // Background color shifts for atmosphere
  gsap.to('body', {
    backgroundColor: '#EDE6D9',
    scrollTrigger: {
      trigger: '.hands',
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: true
    }
  });
}

// ---------- Form (demo only) ----------
document.getElementById('book-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.book-btn span');
  const original = btn.textContent;
  btn.textContent = 'Request received';
  setTimeout(() => {
    btn.textContent = original;
    e.target.reset();
  }, 2500);
});

// ---------- Resize refresh ----------
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
