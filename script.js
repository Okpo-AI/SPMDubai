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
  var animateCards = document.querySelectorAll('.ciq-card, .feature-card, .number-card, .ciq-panel, .ciq-bento-card');
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

  // =============================================
  // Global Operations Hub — Curved Path scroll progress
  // =============================================
  var opsTimeline = document.getElementById('ops-timeline');
  if (opsTimeline) {
    var opsSvg = document.getElementById('ops-curve');
    var opsTrack = opsSvg.querySelector('.ops-curve-track');
    var opsFill = opsSvg.querySelector('.ops-curve-fill');
    var opsSteps = opsTimeline.querySelectorAll('.ops-step');
    var opsNodes = opsTimeline.querySelectorAll('.ops-step-node');
    var opsStepCount = opsSteps.length;
    var opsTotalLength = 0;
    var opsBuilt = false;
    var opsLandmarks = document.querySelectorAll('.ops-landmark');

    // Add SVG gradient definition
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'ops-grad');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#b8860b');
    var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', '#63b3ed');
    grad.appendChild(stop1); grad.appendChild(stop2);
    defs.appendChild(grad);
    opsSvg.insertBefore(defs, opsSvg.firstChild);

    function buildOpsCurve() {
      var timelineRect = opsTimeline.getBoundingClientRect();
      var points = [];
      for (var i = 0; i < opsNodes.length; i++) {
        var nodeRect = opsNodes[i].getBoundingClientRect();
        points.push({
          x: nodeRect.left + nodeRect.width / 2 - timelineRect.left,
          y: nodeRect.top + nodeRect.height / 2 - timelineRect.top
        });
      }

      if (points.length < 2) return;

      var w = timelineRect.width;
      var h = timelineRect.height;
      opsSvg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

      // Build smooth cubic bezier path through node centers
      var d = 'M ' + points[0].x + ' ' + points[0].y;
      for (var j = 0; j < points.length - 1; j++) {
        var cur = points[j];
        var nxt = points[j + 1];
        // Control points at 40% and 60% of vertical distance, keeping horizontal position of current/next
        var cy1 = cur.y + (nxt.y - cur.y) * 0.4;
        var cy2 = cur.y + (nxt.y - cur.y) * 0.6;
        d += ' C ' + cur.x + ' ' + cy1 + ', ' + nxt.x + ' ' + cy2 + ', ' + nxt.x + ' ' + nxt.y;
      }

      opsTrack.setAttribute('d', d);
      opsFill.setAttribute('d', d);

      opsTotalLength = opsFill.getTotalLength();
      opsFill.style.strokeDasharray = opsTotalLength;
      opsFill.style.strokeDashoffset = opsTotalLength;
      opsBuilt = true;
    }

    // Build curve after layout settles
    setTimeout(buildOpsCurve, 100);
    window.addEventListener('resize', function () {
      opsBuilt = false;
      buildOpsCurve();
      requestAnimationFrame(updateOpsProgress);
    });

    var opsTicking = false;

    function updateOpsProgress() {
      var winH = window.innerHeight;
      var midScreen = winH * 0.5;

      // Per-node activation: trigger when node center crosses middle of screen
      for (var i = 0; i < opsStepCount; i++) {
        var nodeRect = opsNodes[i].getBoundingClientRect();
        var nodeCenter = nodeRect.top + nodeRect.height / 2;
        if (nodeCenter <= midScreen) {
          opsSteps[i].classList.add('ops-step-active');
        } else {
          opsSteps[i].classList.remove('ops-step-active');
          opsSteps[i].classList.remove('ops-step-current');
        }
      }

      // Line progress: 0 when first node at mid, 1 when last node at mid
      var lineProgress = 0;
      if (opsStepCount >= 2) {
        var firstRect = opsNodes[0].getBoundingClientRect();
        var lastRect = opsNodes[opsStepCount - 1].getBoundingClientRect();
        var firstY = firstRect.top + firstRect.height / 2;
        var lastY = lastRect.top + lastRect.height / 2;
        var span = lastY - firstY;
        if (span !== 0) {
          lineProgress = (midScreen - firstY) / span;
        }
        lineProgress = Math.max(0, Math.min(1, lineProgress));
      }

      if (opsBuilt && opsTotalLength > 0) {
        opsFill.style.strokeDashoffset = opsTotalLength * (1 - lineProgress);
      }

      // Mark last active as current
      var lastActive = -1;
      for (var j = opsStepCount - 1; j >= 0; j--) {
        if (opsSteps[j].classList.contains('ops-step-active')) {
          lastActive = j;
          break;
        }
      }
      for (var k = 0; k < opsStepCount; k++) {
        opsSteps[k].classList.toggle('ops-step-current', k === lastActive);
      }

      // Direction-aware landmark transitions
      // Only the current landmark is visible; previous and future are hidden
      for (var m = 0; m < opsLandmarks.length; m++) {
        var stepIdx = parseInt(opsLandmarks[m].getAttribute('data-step'), 10);
        if (stepIdx === lastActive) {
          // Current: fully visible
          opsLandmarks[m].style.transform = 'translateY(0)';
          opsLandmarks[m].style.opacity = '1';
        } else if (stepIdx < lastActive) {
          // Previous: hidden (already passed — slid up and out)
          opsLandmarks[m].style.transform = 'translateY(-30%)';
          opsLandmarks[m].style.opacity = '0';
        } else {
          // Future: waiting below
          opsLandmarks[m].style.transform = 'translateY(100%)';
          opsLandmarks[m].style.opacity = '0';
        }
      }

      opsTicking = false;
    }

    function onOpsScroll() {
      if (!opsTicking) {
        opsTicking = true;
        requestAnimationFrame(updateOpsProgress);
      }
    }

    window.addEventListener('scroll', onOpsScroll, { passive: true });
    window.addEventListener('resize', function () {
      requestAnimationFrame(updateOpsProgress);
    });
    updateOpsProgress();
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
