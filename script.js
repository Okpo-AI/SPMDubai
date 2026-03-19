/* Mobile menu toggle */

function ctaFormSubmit(form) {
  var name = form.elements['name'].value.trim();
  var email = form.elements['email'].value.trim();
  var message = form.elements['message'].value.trim();
  var subject = encodeURIComponent('Enquiry from ' + (name || 'Website Visitor'));
  var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
  window.location.href = 'mailto:dubai@spmadrid.ae?subject=' + subject + '&body=' + body;
  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.navbar-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }

  // Animated counters on scroll
  var counters = document.querySelectorAll('[data-count]');
  var observed = new Set();

  function animateCounter(el) {
    var target = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var numericTarget = parseInt(target, 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (numericTarget - start) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed.has(entry.target)) {
          observed.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  // Numbers slideshow
  // Image slideshow — click arrows with slide transition
  var slideshows = document.querySelectorAll('[data-slideshow]');
  slideshows.forEach(function(container) {
    var slides = container.querySelectorAll('.numbers-slide');
    if (slides.length <= 1) return;
    var idx = 0;
    var autoTimer = null;
    var animating = false;

    // Set up slides for horizontal sliding
    slides.forEach(function(s, i) {
      s.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      if (i === 0) {
        s.style.transform = 'translateX(0)';
        s.style.opacity = '1';
      } else {
        s.style.transform = 'translateX(100%)';
        s.style.opacity = '0';
      }
    });

    function goTo(newIdx, direction) {
      if (animating) return;
      animating = true;
      var oldIdx = idx;
      idx = ((newIdx % slides.length) + slides.length) % slides.length;
      if (oldIdx === idx) { animating = false; return; }
      var dir = direction || (newIdx > oldIdx ? 1 : -1);

      // Position new slide off-screen
      slides[idx].style.transition = 'none';
      slides[idx].style.transform = 'translateX(' + (dir * 100) + '%)';
      slides[idx].style.opacity = '0';
      slides[idx].classList.add('active');

      // Force reflow
      void slides[idx].offsetWidth;

      // Animate both
      slides[idx].style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      slides[idx].style.transform = 'translateX(0)';
      slides[idx].style.opacity = '1';

      slides[oldIdx].style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      slides[oldIdx].style.transform = 'translateX(' + (-dir * 100) + '%)';
      slides[oldIdx].style.opacity = '0';

      setTimeout(function() {
        slides[oldIdx].classList.remove('active');
        animating = false;
      }, 500);
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function() { goTo(idx + 1, 1); }, 3500);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    startAuto();

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    container.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    container.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        if (diff > 0) { goTo(idx + 1, 1); } else { goTo(idx - 1, -1); }
        startAuto();
      }
    }, { passive: true });

    // Mouse drag swipe support
    var mouseStartX = 0;
    var isDragging = false;
    container.addEventListener('mousedown', function(e) {
      mouseStartX = e.clientX;
      isDragging = true;
      e.preventDefault();
    });
    container.addEventListener('mousemove', function(e) {
      if (isDragging) { e.preventDefault(); }
    });
    container.addEventListener('mouseup', function(e) {
      if (!isDragging) return;
      isDragging = false;
      var diff = mouseStartX - e.clientX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        if (diff > 0) { goTo(idx + 1, 1); } else { goTo(idx - 1, -1); }
        startAuto();
      }
    });
    container.addEventListener('mouseleave', function() {
      isDragging = false;
    });
  });

  // Also handle the original standalone slideshow if present
  var standaloneSlides = document.querySelectorAll('.numbers-slideshow:not([data-slideshow]) > .numbers-slide');
  if (standaloneSlides.length > 1) {
    var currentSlide = 0;
    setInterval(function () {
      standaloneSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % standaloneSlides.length;
      standaloneSlides[currentSlide].classList.add('active');
    }, 3500);
  }

  // Office tab switching
  var officeTabs = document.querySelectorAll('.office-tab');
  officeTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var office = tab.getAttribute('data-office');
      // Update active tab
      officeTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      // Switch office panel
      document.querySelectorAll('.office-panel').forEach(function(p) { p.classList.remove('active'); });
      var panel = document.getElementById('office-' + office);
      if (panel) panel.classList.add('active');
    });
  });

  // Collection card click – expand detail overlay
  var collectionCards = document.querySelectorAll('.collection-card[data-detail]');
  collectionCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var detail = card.getAttribute('data-detail');
      var overlay = document.getElementById('card-overlay');
      var body = document.getElementById('card-overlay-body');
      if (!overlay || !body) return;

      var info = {
        analytics: {
          title: 'Predictive Analytics',
          text: 'Our AI-powered scoring engine processes 3,000+ accounts across 8 financial institutions, leveraging GCC-specific debtor profiles and payment behavior patterns to achieve an 85% recovery rate — an 18% month-over-month improvement.'
        },
        multichannel: {
          title: 'Multi-Channel Engagement',
          text: 'We reach debtors through Voice (2,450 calls — 85% reach), SMS (1,820 — 72% delivery), Email (960 — 58% delivery), and WhatsApp (1,340 — 91% read rate), operating in Arabic, English, Hindi, and Filipino.'
        },
        monitoring: {
          title: 'Real-Time Monitoring',
          text: '100% QA-monitored calls with real-time compliance tracking. 8,254 debtors contacted, 3,891 promise-to-pay commitments secured, and 5,247 successful collections — all with a 98.7% agent compliance rate.'
        }
      };

      var data = info[detail];
      if (!data) return;
      body.innerHTML = '<h3>' + data.title + '</h3><p>' + data.text + '</p>';
      overlay.classList.add('active');
    });
  });

  // Close overlay
  var overlayClose = document.getElementById('card-overlay-close');
  var overlayBg = document.getElementById('card-overlay');
  if (overlayClose) {
    overlayClose.addEventListener('click', function () {
      overlayBg.classList.remove('active');
    });
  }
  if (overlayBg) {
    overlayBg.addEventListener('click', function (e) {
      if (e.target === overlayBg) overlayBg.classList.remove('active');
    });
  }

  // Scroll-triggered animations (re-trigger on scroll up/down)
  var animateCards = document.querySelectorAll('.ciq-card, .feature-card, .number-card, .ciq-panel, .ciq-bento-card, .privacy-card');
  if ('IntersectionObserver' in window) {
    var cardTimers = new Map();
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = Array.prototype.indexOf.call(entry.target.parentElement.children, entry.target) * 150;
          var timer = setTimeout(function () {
            entry.target.classList.add('animate-in');
          }, delay);
          cardTimers.set(entry.target, timer);
        } else {
          if (cardTimers.has(entry.target)) {
            clearTimeout(cardTimers.get(entry.target));
          }
          entry.target.classList.remove('animate-in');
        }
      });
    }, { threshold: 0.15 });

    animateCards.forEach(function (card) {
      cardObserver.observe(card);
    });

  }

  // Navbar background on scroll + glassmorphic
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
      } else {
        navbar.classList.remove('scrolled');
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // Boots on the Ground entrance animation
  var bootsSection = document.querySelector('.boots-section');
  if (bootsSection && 'IntersectionObserver' in window) {
    var bootsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bootsSection.classList.add('section-visible');
        }
      });
    }, { threshold: 0.1 });
    bootsObs.observe(bootsSection);
  }

  /* =============================================
     ANIMATION ENGINE
     ============================================= */

  // -- Respect reduced-motion --
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -- Spring Physics Class --
  function Spring(stiffness, damping) {
    this.stiffness = stiffness || 120;
    this.damping = damping || 14;
    this.x = 0;
    this.target = 0;
    this.velocity = 0;
  }
  Spring.prototype.update = function (dt) {
    var force = -this.stiffness * (this.x - this.target);
    var dampF = -this.damping * this.velocity;
    this.velocity += (force + dampF) * dt;
    this.x += this.velocity * dt;
    return this.x;
  };
  Spring.prototype.setTarget = function (t) { this.target = t; };

  // -- Hero Parallax on Mouse --
  if (!prefersReduced) {
    var hero = document.querySelector('.hero');
    if (hero) {
      var depthEls = hero.querySelectorAll('[data-depth]');
      if (depthEls.length > 0) {
        function handleParallax(e) {
          var cx = window.innerWidth / 2;
          var cy = window.innerHeight / 2;
          var mx = (e.clientX - cx) / cx;
          var my = (e.clientY - cy) / cy;
          depthEls.forEach(function (el) {
            var d = parseFloat(el.getAttribute('data-depth')) || 0;
            var x = mx * d * 20;
            var y = my * d * 15;
            el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
          });
        }
        hero.addEventListener('mousemove', handleParallax);
      }
    }
  }

  // -- CIQ Cards 3D Tilt on Hover --
  if (!prefersReduced) {
    var arCards = document.querySelectorAll('.ciq-ar-card');
    arCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var rx = -(e.clientY - cy) / rect.height * 8;
        var ry = (e.clientX - cx) / rect.width * 8;
        card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  // -- Section Heading Reveal --
  var headings = document.querySelectorAll('.section-heading');
  var subtitles = document.querySelectorAll('.section-subtitle');
  if (headings.length > 0) {
    var headingObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          headingObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    headings.forEach(function (h) { headingObs.observe(h); });
    subtitles.forEach(function (s) { headingObs.observe(s); });
  }

  // -- CIQ Panel Scroll Reveal --
  var arPanel = document.querySelector('.ciq-ar-panel');
  if (arPanel) {
    var panelObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          panelObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    panelObs.observe(arPanel);
  }

  // -- Button Ripple Position --
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-get-started').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      btn.style.setProperty('--ripple-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--ripple-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  // -- Period Selector Toggle --
  var periodBtns = document.querySelectorAll('.ciq-period-btn');
  periodBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      periodBtns.forEach(function (b) { b.classList.remove('ciq-period-active'); });
      btn.classList.add('ciq-period-active');
    });
  });

  // -- Journey Dimming on CTA Hover --
  if (!prefersReduced) {
    var heroEl = document.querySelector('.hero');
    var heroCtas = heroEl ? heroEl.querySelectorAll('.btn-primary, .btn-get-started') : [];
    heroCtas.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        heroEl.classList.add('journey-dimming');
      });
      btn.addEventListener('mouseleave', function () {
        heroEl.classList.remove('journey-dimming');
      });
    });
  }

  // -- Success Toast Helper --
  window.showSuccessToast = function (msg) {
    var toast = document.querySelector('.micro-success-toast');
    if (!toast) return;
    var textEl = toast.querySelector('.success-check-text');
    if (textEl && msg) textEl.textContent = msg;
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 3000);
  };

  // -- Collections IQ Strategy Toggle --
  window.toggleStrategy = function (type) {
    document.querySelectorAll('.ciq-toggle-btn').forEach(function(btn) {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.ciq-strategy-pane').forEach(function(pane) {
      pane.classList.remove('active');
    });
    
    if (type === 'traditional') {
      document.getElementById('btn-traditional').classList.add('active');
      document.getElementById('pane-traditional').classList.add('active');
    } else {
      document.getElementById('btn-ciq').classList.add('active');
      document.getElementById('pane-ciq').classList.add('active');
    }
  };

  // -- Collections IQ Scroll Animations --
  var ciqElements = document.querySelectorAll('.ciq-animate');
  if (ciqElements.length && 'IntersectionObserver' in window) {
    var ciqObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ciq-visible');
          ciqObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    ciqElements.forEach(function(el) { ciqObserver.observe(el); });
  }

});
