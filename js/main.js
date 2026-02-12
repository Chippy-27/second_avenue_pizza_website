// ===========================
// Second Avenue Pizza
// Main JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initMenuTabs();
  initSmoothScroll();
  initHeroAnimations();
  initPreventZoom();
});

// --- Navbar scroll effect ---
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
}

// --- Mobile menu toggle ---
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
    document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// --- Scroll-triggered animations ---
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.animate-fade-up, .reveal').forEach(el => {
    observer.observe(el);
  });

  // Add reveal class to various elements
  const revealSelectors = [
    '.about-content',
    '.about-visual',
    '.menu-card',
    '.special-card',
    '.hours-content',
    '.hours-map',
    '.contact-card',
    '.section-header',
  ];

  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  });
}

// --- Menu category tabs ---
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide cards with animation
      cards.forEach(card => {
        if (card.dataset.category === category) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// --- Smooth scroll for anchor links ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

// --- Hero entrance animations ---
function initHeroAnimations() {
  // Trigger hero animations after a brief delay
  setTimeout(() => {
    document.querySelectorAll('.hero .animate-fade-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);
}

// --- Prevent zoom-out and snap back on mobile ---
function initPreventZoom() {
  // Prevent iOS Safari gesture zoom
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });
  document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
  });

  // Prevent multi-touch zoom
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Snap back: if browser still allows zoom-out, force it back to 1x
  if (window.visualViewport) {
    var meta = document.querySelector('meta[name="viewport"]');
    var snapBack = function () {
      if (window.visualViewport.scale < 1 || window.visualViewport.offsetLeft !== 0) {
        meta.setAttribute('content',
          'width=device-width, initial-scale=0.999, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        requestAnimationFrame(function () {
          meta.setAttribute('content',
            'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
          // Reset horizontal scroll to prevent left-shift
          window.scrollTo(0, window.scrollY);
          document.documentElement.scrollLeft = 0;
          document.body.scrollLeft = 0;
        });
      }
    };
    window.visualViewport.addEventListener('resize', snapBack);
    document.addEventListener('touchend', snapBack);
  }
}
