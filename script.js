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
  var navActions = document.querySelector('.navbar-actions');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpening = !links.classList.contains('active');
      links.classList.toggle('active');
      toggle.classList.toggle('active');

      // On mobile, move lang switcher inside the nav links panel
      if (navActions && window.innerWidth <= 768) {
        if (isOpening) {
          links.appendChild(navActions);
          navActions.style.display = 'flex';
          navActions.style.flexDirection = 'column';
          navActions.style.padding = '16px 0 0';
          navActions.style.position = 'static';
          navActions.style.background = 'none';
          navActions.style.border = 'none';
          navActions.style.boxShadow = 'none';
        } else {
          // Move it back to original position (after links in navbar-inner)
          var navInner = document.querySelector('.navbar-inner');
          if (navInner) {
            navInner.insertBefore(navActions, toggle);
            navActions.removeAttribute('style');
          }
        }
      }
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('active');
        toggle.classList.remove('active');
        // Move lang switcher back
        if (navActions && window.innerWidth <= 768) {
          var navInner = document.querySelector('.navbar-inner');
          if (navInner) {
            navInner.insertBefore(navActions, toggle);
            navActions.removeAttribute('style');
          }
        }
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

  // --- Numbers Stack Slider (Dribbble-inspired) ---
  var currentStackIndex = 0;
  var currentOffice = 'dubai';

  function updateStackClasses() {
    var container = document.querySelector('#stack-' + currentOffice);
    if (!container) return;
    var items = container.querySelectorAll('.stack-item');
    var total = items.length;

    items.forEach(function(item, idx) {
      item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
      
      var diff = (idx - currentStackIndex + total) % total;
      
      if (diff === 0) {
        item.classList.add('active');
      } else if (diff === 1) {
        item.classList.add('next');
      } else if (diff === 2) {
        item.classList.add('far-next');
      } else if (diff === total - 1) {
        item.classList.add('prev');
      } else if (diff === total - 2) {
        item.classList.add('far-prev');
      }
    });

    // Update progress dots
    var dotsContainer = document.getElementById('stack-progress-dots');
    if (dotsContainer) {
      if (dotsContainer.childElementCount !== total) {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < total; i++) {
          var dot = document.createElement('div');
          dot.className = 'stack-dot';
          dot.setAttribute('data-index', i);
          dot.addEventListener('click', function(e) {
            currentStackIndex = parseInt(e.target.getAttribute('data-index'));
            updateStackClasses();
            if (typeof stopStackAuto === 'function') { stopStackAuto(); startStackAuto(); }
          });
          dotsContainer.appendChild(dot);
        }
      }
      
      var dots = dotsContainer.querySelectorAll('.stack-dot');
      dots.forEach(function(dot, i) {
        if (i === currentStackIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  function moveStack(direction) {
    var container = document.querySelector('#stack-' + currentOffice);
    if (!container) return;
    var total = container.querySelectorAll('.stack-item').length;

    if (direction === 'next') {
      currentStackIndex = (currentStackIndex + 1) % total;
    } else {
      currentStackIndex = (currentStackIndex - 1 + total) % total;
    }
    updateStackClasses();
  }

  // Bind Card Clicks and Lightbox
  document.querySelectorAll('.stack-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (item.classList.contains('active')) {
        // Open lightbox
        var imgUrl = item.querySelector('.stack-item-img').style.backgroundImage;
        imgUrl = imgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        var imageModal = document.getElementById('image-modal');
        var imageModalImg = document.getElementById('image-modal-img');
        if (imageModal && imageModalImg && imgUrl) {
          imageModalImg.src = imgUrl;
          imageModal.classList.add('active');
        }
        return;
      }
      var idx = parseInt(item.getAttribute('data-index'));
      currentStackIndex = idx;
      updateStackClasses();
      if (typeof stopStackAuto === 'function') { stopStackAuto(); startStackAuto(); }
    });
  });

  // Handle Image Modal Close
  var imgModalClose = document.getElementById('image-modal-close');
  var imgModal = document.getElementById('image-modal');
  if (imgModalClose) {
    imgModalClose.addEventListener('click', function() {
      imgModal.classList.remove('active');
    });
  }
  if (imgModal) {
    imgModal.addEventListener('click', function(e) {
      if (e.target === imgModal) imgModal.classList.remove('active');
    });
  }

  // Office Dropdown Switching
  var officeToggleBtn = document.getElementById('office-toggle-btn');
  var officeDropdown = document.getElementById('office-dropdown-menu');
  var officeDropdownItems = document.querySelectorAll('.office-dropdown-item');
  var officeToggleLabel = document.querySelector('.office-toggle-label');

  if (officeToggleBtn && officeDropdown) {
    officeToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var expanded = officeToggleBtn.getAttribute('aria-expanded') === 'true';
      officeToggleBtn.setAttribute('aria-expanded', !expanded);
      officeDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
      if (!officeToggleBtn.contains(e.target) && !officeDropdown.contains(e.target)) {
        officeToggleBtn.setAttribute('aria-expanded', 'false');
        officeDropdown.classList.remove('open');
      }
    });

    officeDropdownItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var office = item.getAttribute('data-office');
        currentOffice = office;
        currentStackIndex = 0;
        
        officeToggleLabel.textContent = item.textContent;
        officeDropdownItems.forEach(function(t) { t.classList.remove('active'); });
        item.classList.add('active');
        officeDropdown.classList.remove('open');
        officeToggleBtn.setAttribute('aria-expanded', 'false');

        document.querySelectorAll('.stack-container').forEach(function(c) {
          c.classList.add('hidden');
        });
        var activeStack = document.getElementById('stack-' + currentOffice);
        if (activeStack) activeStack.classList.remove('hidden');

        // Address toggle
        document.querySelectorAll('.office-address-item').forEach(function(addr) {
          addr.classList.remove('active');
        });
        var addrKey = (currentOffice === 'philippines') ? 'ph' : 'dubai';
        var activeAddr = document.querySelector('.office-address-item.' + addrKey);
        if (activeAddr) activeAddr.classList.add('active');

        updateStackClasses();
        if (typeof stopStackAuto === 'function') { stopStackAuto(); startStackAuto(); }
      });
    });
  }

  // Swipe and Drag Logic
  var stackWrap = document.querySelector('.stack-containers-wrap');
  if (stackWrap) {
    var swTouchStartX = 0, swTouchEndX = 0, swIsDragging = false, swMouseStartX = 0;
    
    // Touch
    stackWrap.addEventListener('touchstart', function(e) {
      swTouchStartX = e.changedTouches[0].screenX;
      stopStackAuto();
    }, { passive: true });
    
    stackWrap.addEventListener('touchend', function(e) {
      swTouchEndX = e.changedTouches[0].screenX;
      var diff = swTouchStartX - swTouchEndX;
      if (Math.abs(diff) > 40) {
        moveStack(diff > 0 ? 'next' : 'prev');
      }
      startStackAuto();
    }, { passive: true });

    // Mouse
    stackWrap.addEventListener('mousedown', function(e) {
      swMouseStartX = e.clientX;
      swIsDragging = true;
      stopStackAuto();
      e.preventDefault();
    });
    
    stackWrap.addEventListener('mousemove', function(e) {
      if (swIsDragging) e.preventDefault();
    });
    
    stackWrap.addEventListener('mouseup', function(e) {
      if (!swIsDragging) return;
      swIsDragging = false;
      var diff = swMouseStartX - e.clientX;
      if (Math.abs(diff) > 40) {
        moveStack(diff > 0 ? 'next' : 'prev');
      }
      startStackAuto();
    });
    
    stackWrap.addEventListener('mouseleave', function() {
      if (swIsDragging) {
        swIsDragging = false;
        startStackAuto();
      }
    });

    // Autoplay logic
    var stackAutoTimer = null;
    function startStackAuto() {
      stopStackAuto();
      stackAutoTimer = setInterval(function() {
        moveStack('next');
      }, 4000);
    }
    function stopStackAuto() {
      if (stackAutoTimer) {
        clearInterval(stackAutoTimer);
        stackAutoTimer = null;
      }
    }

    // Pause on hover
    stackWrap.addEventListener('mouseenter', stopStackAuto);
    stackWrap.addEventListener('mouseleave', function() {
      if (!swIsDragging) startStackAuto();
    });

    startStackAuto();
  }

  // Initial State
  updateStackClasses();



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

  // =============================================
  // Team Executive Accordion + Mobile Carousel
  // =============================================
  var teamPanels = document.querySelectorAll('.team-panel[data-index]');
  var isMobileView = false;
  var track, dotsContainer, slideWidth, currentIndex = 1;

  function initTeamCarousel() {
    var accordion = document.querySelector('.team-accordion');
    if (!accordion || !teamPanels.length) return;

    var isMobile = window.innerWidth <= 768;
    if (isMobile && !isMobileView) {
      isMobileView = true;
      var panels = Array.from(teamPanels);
      var totalOriginal = panels.length;

      // Remove desktop active class
      panels.forEach(p => p.classList.remove('active'));

      // Create track
      track = document.createElement('div');
      track.className = 'team-carousel-track';

      // Clones for infinite loop
      var cloneLast = panels[totalOriginal - 1].cloneNode(true);
      var cloneFirst = panels[0].cloneNode(true);
      cloneLast.classList.add('carousel-clone');
      cloneFirst.classList.add('carousel-clone');

      track.appendChild(cloneLast);
      panels.forEach(p => track.appendChild(p));
      track.appendChild(cloneFirst);
      accordion.innerHTML = '';
      accordion.appendChild(track);

      // Dots
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      for (var d = 0; d < totalOriginal; d++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (d === 0 ? ' active' : '');
        dot.setAttribute('data-slide', d);
        dotsContainer.appendChild(dot);
      }
      accordion.parentNode.insertBefore(dotsContainer, accordion.nextSibling);

      // Events
      setupCarouselEvents();
      
      // Initial positioning - CEO (Ian Madrid) is always the default starting card
      window.requestAnimationFrame(() => {
        updateDimensions();
        currentIndex = 1; // Ian Madrid is at index 1 (between prepended clone and Anita)
        goToSlide(currentIndex, false);
      });
    } else if (!isMobile && isMobileView) {
      // Revert if needed, but typically mobile stays mobile once loaded for simplicity on this site
      // location.reload(); 
    }
  }

  function updateDimensions() {
    if (!track || !track.children.length) return;
    slideWidth = track.children[0].offsetWidth + 6; // 55vw + 6px gap
  }

  function goToSlide(index, animate) {
    if (!track) return;
    currentIndex = index;
    track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.3, 1, 0.4, 1)' : 'none';
    var viewportWidth = window.innerWidth;
    var offset = -(currentIndex * slideWidth) + (viewportWidth - slideWidth) / 2;
    track.style.transform = 'translateX(' + offset + 'px)';
    updateActiveStates();
  }

  function updateActiveStates() {
    var allSlides = track.children;
    for (var i = 0; i < allSlides.length; i++) {
        allSlides[i].classList.remove('carousel-active');
    }
    if (allSlides[currentIndex]) {
        allSlides[currentIndex].classList.add('carousel-active');
    }

    var realIndex = currentIndex - 1;
    var total = teamPanels.length;
    if (realIndex < 0) realIndex = total - 1;
    if (realIndex >= total) realIndex = 0;
    
    var dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dt, idx) => dt.classList.toggle('active', idx === realIndex));
  }

  function setupCarouselEvents() {
    var accordion = document.querySelector('.team-accordion');
    var total = teamPanels.length;

    track.addEventListener('transitionend', () => {
      if (currentIndex === 0) goToSlide(total, false);
      if (currentIndex === total + 1) goToSlide(1, false);
    });

    dotsContainer.addEventListener('click', (e) => {
      var dot = e.target.closest('.carousel-dot');
      if (dot) goToSlide(parseInt(dot.getAttribute('data-slide')) + 1, true);
    });

    // Reuse and adapt swipe logic
    var touchStartX = 0, touchEndX = 0, isDragging = false, baseOffset = 0, isHorizontal = null;

    accordion.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      baseOffset = -(currentIndex * slideWidth) + (window.innerWidth - slideWidth) / 2;
      track.style.transition = 'none';
      isDragging = true;
      isHorizontal = null;
    }, { passive: true });

    accordion.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      touchEndX = e.touches[0].clientX;
      var dx = touchEndX - touchStartX;
      var dy = e.touches[0].clientY - e.touches[0].clientY; // Simplified for brevity, standard check below
      if (isHorizontal === null) isHorizontal = Math.abs(dx) > 5;
      if (isHorizontal) {
        e.preventDefault();
        track.style.transform = 'translateX(' + (baseOffset + dx) + 'px)';
      }
    }, { passive: false });

    accordion.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      var diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 50) {
        goToSlide(currentIndex + (diffX > 0 ? 1 : -1), true);
      } else {
        goToSlide(currentIndex, true);
      }
    });

    // Mouse support
    accordion.addEventListener('mousedown', (e) => {
      touchStartX = e.clientX;
      baseOffset = -(currentIndex * slideWidth) + (window.innerWidth - slideWidth) / 2;
      track.style.transition = 'none';
      isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      touchEndX = e.clientX;
      track.style.transform = 'translateX(' + (baseOffset + (touchEndX - touchStartX)) + 'px)';
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      var diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 50) {
        goToSlide(currentIndex + (diffX > 0 ? 1 : -1), true);
      } else {
        goToSlide(currentIndex, true);
      }
    });
  }

  window.addEventListener('resize', () => {
    updateDimensions();
    if (isMobileView) goToSlide(currentIndex, false);
  });

  initTeamCarousel();
  window.addEventListener('load', initTeamCarousel);

  // Desktop accordion logic (if not on mobile)
  if (!isMobileView && teamPanels.length) {
    teamPanels.forEach(function(panel) {
      var eventType = ('ontouchstart' in window) ? 'click' : 'mouseenter';
      panel.addEventListener(eventType, function() {
        if (panel.classList.contains('active')) return;
        teamPanels.forEach(function(p) { p.classList.remove('active'); });
        panel.classList.add('active');
      });
    });
  }



  // Team panels scroll-in stagger animation
  if (teamPanels.length && 'IntersectionObserver' in window) {
    var teamObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          teamPanels.forEach(function(p) { p.classList.add('team-visible'); });
          teamObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    var accordionParent = document.querySelector('.team-accordion');
    if (accordionParent) teamObs.observe(accordionParent);
  }


  // =============================================
  // Language Switcher & i18n
  // =============================================
  var langToggleBtn = document.getElementById('lang-toggle-btn');
  var langDropdown = document.getElementById('lang-dropdown');
  var langItems = langDropdown ? langDropdown.querySelectorAll('.lang-dropdown-item') : [];
  var i18nData = null;

  // Toggle dropdown
  if (langToggleBtn && langDropdown) {
    langToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = langDropdown.classList.toggle('open');
      langToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!langToggleBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
        langToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Resolve a dot-notation key from an object (e.g. "hero.title" → obj.hero.title)
  function resolveKey(obj, key) {
    return key.split('.').reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  // Apply translations to all [data-i18n] elements
  function applyTranslations(lang) {
    if (!i18nData || !i18nData[lang]) return;
    var translations = i18nData[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = resolveKey(translations, key);
      if (value && typeof value === 'string') {
        // Preserve child elements (like icons) — only replace text nodes
        if (el.childElementCount === 0) {
          el.textContent = value;
        } else {
          // Replace first text node only
          var textNode = null;
          for (var i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) {
              textNode = el.childNodes[i];
              break;
            }
          }
          if (textNode) {
            textNode.textContent = value;
          } else {
            el.textContent = value;
          }
        }
      }
    });

    // Update placeholders for form inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var value = resolveKey(translations, key);
      if (value) el.setAttribute('placeholder', value);
    });

    // Set dir and lang on <html>
    var dir = translations.dir || 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }

  function switchLanguage(lang) {
    // Update active state in dropdown
    langItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });

    // Update toggle label
    var label = langToggleBtn ? langToggleBtn.querySelector('.lang-toggle-label') : null;
    if (label) {
      var langLabels = { en: 'English', ar: 'العربية' };
      label.textContent = langLabels[lang] || 'English';
    }

    // Close dropdown
    if (langDropdown) {
      langDropdown.classList.remove('open');
      if (langToggleBtn) langToggleBtn.setAttribute('aria-expanded', 'false');
    }

    // Apply translations
    applyTranslations(lang);

    // Persist choice
    try { localStorage.setItem('spm-lang', lang); } catch (e) { /* ignore */ }
  }

  // Bind dropdown items
  langItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      var lang = item.getAttribute('data-lang');
      if (lang) switchLanguage(lang);
    });
  });

  // Load i18n data and apply saved language
  fetch('i18n.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      i18nData = data;
      var saved = null;
      try { saved = localStorage.getItem('spm-lang'); } catch (e) { /* ignore */ }
      if (saved && saved !== 'en') {
        switchLanguage(saved);
      }
    })
    .catch(function () {
      // i18n.json not available — language switcher will be visual-only
    });

});
