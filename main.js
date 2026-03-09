/* =============================================
   LED62 — main.js
   ============================================= */

// ---- Mobile Nav ----
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
  });

  // Close when a nav link is clicked (useful on mobile SPA-style)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      navToggle.focus();
    }
  });
}

// ---- Active nav link ----
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
});

// ---- FAQ Accordion ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Contact Form ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // TODO: Replace with Formspree, EmailJS, or your backend endpoint
    // Example with Formspree:
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST', body: new FormData(contactForm),
    //   headers: { Accept: 'application/json' }
    // });
    await new Promise(r => setTimeout(r, 1000)); // simulate
    const msg = document.getElementById('form-success');
    if (msg) { msg.hidden = false; msg.focus(); }
    contactForm.reset();
    btn.textContent = orig;
    btn.disabled = false;
  });
}

// ---- Scroll reveal ----
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}