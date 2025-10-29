/* =========================
   scripts.js
   JavaScript for interactivity:
   - Mobile menu toggle
   - Header style on scroll
   - Smooth scroll for internal links
   - Reveal on scroll using IntersectionObserver
   - Simple contact form client-side validation (no backend)
   - Modal video open/close
   - NEW: Portfolio card image slider
   ========================= */

/* -------------------------
   Helpers
   ------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* -------------------------
   DOM Elements
   ------------------------- */
const header = $('#site-header');
const menuToggle = $('#menu-toggle');
const mainNav = $('#main-nav');
const navLinks = $$('#main-nav a');
const playBtn = $('#play-video');
const modal = $('#video-modal');
const modalCloseElems = modal ? $$('.modal [data-close]') : [];
const revealElems = $$('.reveal');
const form = $('#contact-form');
const feedback = $('#form-feedback');
const yearSpan = $('#year');
const closeBtn = document.getElementById('close-modal');
const video = document.getElementById('showreel');

/* -------------------------
   Header: change background on scroll
   ------------------------- */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/* -------------------------
   Mobile menu toggle
   ------------------------- */
menuToggle && menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));

  if (mainNav.style.display === 'block') {
    mainNav.style.display = '';
  } else {
    mainNav.style.display = 'block';
    mainNav.style.position = 'absolute';
    mainNav.style.right = '18px';
    mainNav.style.top = '64px';
    mainNav.style.background = 'rgba(0,0,0,0.6)';
    mainNav.style.padding = '12px';
    mainNav.style.borderRadius = '8px';
  }
});

/* -------------------------
   Modal Video Player
   ------------------------- */
if (playBtn && modal && closeBtn && video) {
  playBtn.addEventListener('click', () => {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    video.currentTime = 0;
    video.play().catch(() => {});
    document.documentElement.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    video.pause();
    document.documentElement.style.overflow = '';
  });
}

/* -------------------------
   Close mobile nav when a link is clicked
   ------------------------- */
navLinks.forEach(a =>
  a.addEventListener('click', () => {
    if (window.innerWidth <= 800) {
      mainNav.style.display = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  })
);

/* -------------------------
   Smooth scroll for anchor links
   ------------------------- */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', href);
  }
});

/* -------------------------
   Reveal on scroll (IntersectionObserver)
   ------------------------- */
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElems.forEach(el => observer.observe(el));
} else {
  revealElems.forEach(el => el.classList.add('show'));
}

/* -------------------------
   Contact form: basic validation
   ------------------------- */
form && form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name').trim();
  const email = data.get('email').trim();
  const message = data.get('message').trim();

  if (!name || !email || !message) {
    feedback.textContent = 'Please fill out all fields.';
    feedback.style.color = '#ffb3a7';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    feedback.textContent = 'Please enter a valid email address.';
    feedback.style.color = '#ffb3a7';
    return;
  }

  feedback.textContent = 'Sending...';
  feedback.style.color = '#fff';

  setTimeout(() => {
    feedback.textContent = 'Thanks! Your message was sent (simulated).';
    feedback.style.color = '#b8f1d8';
    form.reset();
  }, 800);
});

/* -------------------------
   Modal video open/close accessibility
   ------------------------- */
if (playBtn && modal) {
  const video = $('#showreel');

  playBtn.addEventListener('click', () => {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    document.documentElement.style.overflow = 'hidden';
  });

  modalCloseElems.forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    document.documentElement.style.overflow = '';
  }
}

/* -------------------------
   NEW FEATURE: Portfolio image slider
   ------------------------- */
const sliders = $$('.project-card');
sliders.forEach(card => {
  const images = card.querySelectorAll('.slide');
  if (images.length <= 1) return;

  let index = 0;

  // Create navigation arrows
  const prev = document.createElement('button');
  const next = document.createElement('button');
  prev.className = 'slider-btn prev';
  next.className = 'slider-btn next';
  prev.textContent = '‹';
  next.textContent = '›';
  card.appendChild(prev);
  card.appendChild(next);

  function showSlide(i) {
    images.forEach((img, n) => {
      img.style.opacity = n === i ? 1 : 0;
      img.style.transition = 'opacity 0.6s ease';
    });
  }

  showSlide(index);

  prev.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    showSlide(index);
  });

  next.addEventListener('click', () => {
    index = (index + 1) % images.length;
    showSlide(index);
  });
});



/* new code*/
/* =========================
   🖼 Project Image Slider — Fixed with Buttons
   ========================= */
document.querySelectorAll(".image-slider").forEach((slider) => {
  const slides = slider.querySelector(".slides");
  const images = slides.querySelectorAll("img");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  let index = 0;

  // Move slides function
  function showSlide(i) {
    index = (i + images.length) % images.length; // wrap-around
    slides.style.transform = `translateX(-${index * 100}%)`;
  }

  // Button listeners
  prevBtn.addEventListener("click", () => {
    showSlide(index - 1);
  });

  nextBtn.addEventListener("click", () => {
    showSlide(index + 1);
  });

  // Optional: Auto-slide every 3s
  setInterval(() => {
    showSlide(index + 1);
  }, 3000);
});






/* -------------------------
   Current year
   ------------------------- */
yearSpan && (yearSpan.textContent = new Date().getFullYear());
