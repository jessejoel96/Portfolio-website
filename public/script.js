/**
 * Jesse-Joel Nzumafor - Portfolio
 * Interactive behavior, animations, and utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCursorGlow();
  initMagneticButtons();
  initProjectFilters();
  initProjectExpand();
  initTilt();
  initScrollEffects();
  initYear();
  initSmoothScroll();
  initOfferPopup();
});

function initNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks?.classList.contains('open'));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

function initMagneticButtons() {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

function initProjectFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.projects-grid .project-card');
  const featured = document.querySelector('.project-featured .project-card-featured');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((f) => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      if (featured) {
        featured.classList.remove('hidden');
        if (filter !== 'all' && featured.dataset.category !== filter) {
          featured.classList.add('hidden');
        }
      }
    });
  });
}

function initProjectExpand() {
  const featured = document.querySelector('.project-card-featured');
  const expandBtn = featured?.querySelector('.project-expand-btn');
  const collapseBtn = featured?.querySelector('.project-collapse-btn');

  expandBtn?.addEventListener('click', () => {
    featured.classList.add('expanded');
  });
  collapseBtn?.addEventListener('click', () => {
    featured.classList.remove('expanded');
  });
}

function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      el.style.transform = `perspective(500px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

function initScrollEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('visible');
        }
      });
    },
    observerOptions
  );

  const animateElements = document.querySelectorAll(
    '.role-card, .skill-category, .project-card, .company-card, .project-list-card, .project-detail-section, [data-role], [data-skill], [data-company]'
  );

  animateElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.filter-btn').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || this.hasAttribute('data-offer-trigger')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initOfferPopup() {
  const popup = document.getElementById('offerPopup');
  const fab = document.getElementById('offerFab');
  if (!popup) return;

  const STORAGE_KEY = 'navari-offer-dismissed';
  const DISMISS_DAYS = 7;
  const AUTO_DELAY_MS = 11000;

  const isDismissed = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  };

  const rememberDismissal = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  const showFab = () => {
    if (fab) fab.hidden = false;
  };

  const hideFab = () => {
    if (fab) fab.hidden = true;
  };

  const openPopup = () => {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('offer-popup-open');
    hideFab();
    popup.querySelector('.offer-popup-close')?.focus();
  };

  const closePopup = (remember = true) => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('offer-popup-open');
    if (remember) {
      rememberDismissal();
      showFab();
    }
  };

  popup.querySelectorAll('[data-offer-close]').forEach((el) => {
    el.addEventListener('click', () => closePopup(true));
  });

  document.querySelectorAll('[data-offer-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  fab?.addEventListener('click', openPopup);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup(true);
    }
  });

  if (isDismissed()) {
    showFab();
    return;
  }

  window.setTimeout(openPopup, AUTO_DELAY_MS);
}
