/* ============================================
   Global JavaScript - Shared Across All Pages
   ============================================ */

// ============================================
// Page Preloader
// ============================================
window.addEventListener('load', function() {
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
      setTimeout(() => {
        pageLoader.classList.add('loaded');
      }, 300);
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.querySelector('.navbar-custom');
    
    if (navbar) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }
  
    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px',
      threshold: 0.15
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    // Observe all scroll animation elements
    const animatedElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
    );
    
    animatedElements.forEach(el => observer.observe(el));
  
    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // ============================================
    // Mobile Menu - Close on Link Click
    // ============================================
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && navbarToggler) {
      // Close menu when clicking on nav links (except dropdowns)
      const navLinks = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)');
      
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          if (window.innerWidth < 992) {
            const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        });
      });
  
      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
          if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse && navbarCollapse.classList.contains('show')) {
              bsCollapse.hide();
            }
          }
        }
      });
    }
  
    // ============================================
    // Counter Animation
    // ============================================
    function animateCounter(element, target, duration = 2000) {
      let start = 0;
      const increment = target / (duration / 16);
      let animationFrame;
      
      function updateCounter() {
        start += increment;
        if (start < target) {
          element.textContent = Math.floor(start);
          animationFrame = requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
          cancelAnimationFrame(animationFrame);
        }
      }
      
      updateCounter();
    }
  
    // Initialize counters when they become visible
    const counters = document.querySelectorAll('[data-counter], [data-count], .counter[data-count]');
    
    if (counters.length > 0) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-counter') || entry.target.getAttribute('data-count'));
            if (target && !isNaN(target)) {
              entry.target.classList.add('counted');
              animateCounter(entry.target, target, 2500);
              counterObserver.unobserve(entry.target);
            }
          }
        });
      }, { threshold: 0.3 });
  
      counters.forEach(counter => counterObserver.observe(counter));
    }
  
    // ============================================
    // Back to Top Button
    // ============================================
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      });
  
      backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  
    // ============================================
    // Contact Form Validation
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      const submitBtn = contactForm.querySelector('.btn-submit');
      
      // Validation patterns
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[\d\s\-+()]{10,}$/;
      
      // Validate single field
      function validateField(field, pattern = null, minLength = 1) {
        const value = field.value.trim();
        let isValid = value.length >= minLength;
        
        if (pattern && isValid) {
          isValid = pattern.test(value);
        }
        
        if (isValid) {
          field.classList.remove('is-invalid');
          field.classList.add('is-valid');
        } else {
          field.classList.remove('is-valid');
          field.classList.add('is-invalid');
        }
        
        return isValid;
      }
      
      // Add blur event listeners for real-time validation
      fullName.addEventListener('blur', () => validateField(fullName, null, 2));
      email.addEventListener('blur', () => validateField(email, emailPattern));
      subject.addEventListener('blur', () => validateField(subject, null, 3));
      message.addEventListener('blur', () => validateField(message, null, 10));
      
      if (phone) {
        phone.addEventListener('blur', () => {
          if (phone.value.trim()) {
            validateField(phone, phonePattern);
          } else {
            phone.classList.remove('is-invalid', 'is-valid');
          }
        });
      }
      
      // Form submission
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all required fields
        const isNameValid = validateField(fullName, null, 2);
        const isEmailValid = validateField(email, emailPattern);
        const isSubjectValid = validateField(subject, null, 3);
        const isMessageValid = validateField(message, null, 10);
        
        // Optional phone validation
        let isPhoneValid = true;
        if (phone && phone.value.trim()) {
          isPhoneValid = validateField(phone, phonePattern);
        }
        
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid && isPhoneValid) {
          // Show loading state
          submitBtn.classList.add('loading');
          submitBtn.innerHTML = '<span class="spinner"></span><span class="btn-text">Sending...</span>';
          
          // Simulate form submission (replace with actual AJAX call)
          setTimeout(() => {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success-message show';
            successMsg.innerHTML = '<i class="bi bi-check-circle"></i><strong>Thank you!</strong><br>Your message has been sent successfully. We\'ll get back to you soon.';
            contactForm.insertBefore(successMsg, contactForm.firstChild);
            
            // Reset form
            contactForm.reset();
            contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
              el.classList.remove('is-valid', 'is-invalid');
            });
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Send Message';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              successMsg.remove();
            }, 5000);
          }, 1500);
        }
      });
    }
  
    // ============================================
    // Parallax Effect for Hero Banners
    // ============================================
    const parallaxElements = document.querySelectorAll('.hero-banner, .page-banner, .about-banner');
    
    if (parallaxElements.length > 0 && window.innerWidth > 768) {
      let ticking = false;
      
      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
              const rate = scrolled * 0.2;
              el.style.backgroundPositionY = `calc(50% + ${rate}px)`;
            });
            
            ticking = false;
          });
          
          ticking = true;
        }
      });
    }
  
    // ============================================
    // Client Logos Slider
    // ============================================
    const logosTrack = document.getElementById('logosTrack');
    const logoPrevBtn = document.getElementById('logoPrevBtn');
    const logoNextBtn = document.getElementById('logoNextBtn');
    
    if (logosTrack) {
      let currentPosition = 0;
      const logoItems = document.querySelectorAll('.logo-item');
      const itemWidth = logoItems[0]?.offsetWidth || 250;
      const gap = 32; // 2rem gap
      const itemWithGap = itemWidth + gap;
      const maxPosition = itemWithGap * 3;
      
      function updatePosition() {
        logosTrack.style.transform = `translateX(-${currentPosition}px)`;
      }
      
      function slideNext() {
        currentPosition += itemWithGap;
        
        // Reset to beginning when reaching the end
        if (currentPosition >= maxPosition) {
          currentPosition = 0;
        }
        
        updatePosition();
      }
      
      function slidePrev() {
        currentPosition -= itemWithGap;
        
        // Reset to end when going before the beginning
        if (currentPosition < 0) {
          currentPosition = maxPosition - itemWithGap;
        }
        
        updatePosition();
      }
      
      // Button event listeners
      logoPrevBtn?.addEventListener('click', slidePrev);
      logoNextBtn?.addEventListener('click', slideNext);
      
      // Auto-slide every 6 seconds
      setInterval(slideNext, 6000);
    }
  
    // ============================================
    // Tooltip Initialization (Bootstrap)
    // ============================================
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length > 0) {
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  
    // ============================================
    // Active Navigation Link Highlight
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksForHighlight = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinksForHighlight.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  
    // ============================================
    // Image Lazy Loading Enhancement
    // ============================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
  
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  
    // ============================================
    // Scroll Progress Indicator (optional)
    // ============================================
    const progressBar = document.querySelector('.scroll-progress');
    
    if (progressBar) {
      window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
      });
    }
  
  });
  
  // ============================================
  // Utility Functions
  // ============================================
  
  // Debounce function for performance optimization
  function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Throttle function for scroll events
  function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  