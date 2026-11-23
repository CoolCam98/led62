/* =============================================
   LED62 — main.js
   ============================================= */

// ---- Mobile Nav ----
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

function setNav(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  navLinks.classList.toggle('open', open);
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    setNav(!open);
  });

  // Close when a nav link is clicked (useful on mobile SPA-style)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setNav(false);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav')) {
      setNav(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNav(false);
      navToggle.focus();
    }
  });
}

// ---- Active nav link ----
// Netlify serves clean URLs (/about), while nav links point to about.html
const pageName = (p) => (p.split('/').pop() || 'index').replace(/\.html$/, '');
const page = pageName(window.location.pathname);
document.querySelectorAll('.nav-links a').forEach(a => {
  if (pageName(a.getAttribute('href')) === page) a.setAttribute('aria-current', 'page');
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
  contactForm.addEventListener('submit', (e) => {
    const btn = contactForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    // Let the form submit naturally to Netlify
    // The success message is handled by Netlify's redirect
  });
}

// ---- Order Form ----
const orderForm = document.getElementById('order-form');
const MAX_UPLOAD_BYTES = 7.5 * 1024 * 1024; // leaves room for the other form fields
if (orderForm) {
  const orderFile = orderForm.querySelector('#order-file');
  if (orderFile) orderFile.addEventListener('change', () => orderFile.setCustomValidity(''));

  const successEl = document.getElementById('order-form-success');
  const errorEl   = document.getElementById('order-form-error');
  const submitBtn = orderForm.querySelector('[type="submit"]');

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!orderForm.reportValidity()) return;

    // Netlify rejects form submissions over 8MB total
    const fileInput = orderForm.querySelector('#order-file');
    const file = fileInput && fileInput.files[0];
    if (file && file.size > MAX_UPLOAD_BYTES) {
      fileInput.setCustomValidity('This file is over 8MB. Please upload a smaller version, or email it to us at led62.info@gmail.com.');
      fileInput.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    if (errorEl) errorEl.hidden = true;

    const formData = new FormData(orderForm);

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        orderForm.reset();
        orderForm.hidden = true;
        if (successEl) successEl.hidden = false;
        if (successEl) successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(() => {
        if (errorEl) errorEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Order Request';
      });
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