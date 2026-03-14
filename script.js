/* Mobile menu toggle */
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
  var slides = document.querySelectorAll('.numbers-slide');
  if (slides.length > 1) {
    var currentSlide = 0;
    setInterval(function () {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 3500);
  }

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
  var animateCards = document.querySelectorAll('.ciq-card, .feature-card, .number-card, .ops-card, .ciq-panel');
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

  // Lifecycle scroll-progress animation
  var lcTimeline = document.querySelector('.lc-timeline');
  if (lcTimeline) {
    var lcLine = lcTimeline.querySelector('.lc-line');
    var lcSteps = lcTimeline.querySelectorAll('.lc-step');
    var stepCount = lcSteps.length;
    var thresholds = [];
    for (var i = 0; i < stepCount; i++) {
      // First step at 0.15 progress, evenly spaced after that
      thresholds.push(0.15 + (i * 0.7 / stepCount));
    }
    var lcTicking = false;

    function updateLifecycleProgress() {
      // Track the timeline element directly
      var rect = lcTimeline.getBoundingClientRect();
      var winH = window.innerHeight;
      // Start: timeline top hits 60% of viewport (lower half, just entered)
      // End: timeline top hits 20% of viewport (upper area, still fully visible)
      var start = winH * 0.6;
      var end = winH * 0.2;
      var progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      lcTimeline.style.setProperty('--lc-progress', progress);

      // Scale line progress so it reaches 100% when last step activates
      var lastThreshold = thresholds[stepCount - 1];
      var lineProgress = Math.min(1, progress / (lastThreshold + 0.05));
      lcTimeline.style.setProperty('--lc-line-progress', lineProgress);

      for (var i = 0; i < stepCount; i++) {
        var step = lcSteps[i];
        if (progress >= thresholds[i]) {
          step.classList.add('lc-step-active');
        } else {
          step.classList.remove('lc-step-active');
          step.classList.remove('lc-step-current');
        }
      }

      var lastActive = -1;
      for (var j = stepCount - 1; j >= 0; j--) {
        if (lcSteps[j].classList.contains('lc-step-active')) {
          lastActive = j;
          break;
        }
      }
      for (var k = 0; k < stepCount; k++) {
        lcSteps[k].classList.toggle('lc-step-current', k === lastActive);
      }

      lcTicking = false;
    }

    function onLcScroll() {
      if (!lcTicking) {
        lcTicking = true;
        requestAnimationFrame(updateLifecycleProgress);
      }
    }

    window.addEventListener('scroll', onLcScroll, { passive: true });
    window.addEventListener('resize', function () {
      requestAnimationFrame(updateLifecycleProgress);
    });
    updateLifecycleProgress();
  }

  // Navbar background on scroll
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }
});
