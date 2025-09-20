// Progress bar functionality
function updateProgressBar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    const progressBar = document.getElementById('progress-bar');
    const progressGlow = document.getElementById('progress-glow');
    
    if (progressBar && progressGlow) {
        progressBar.style.width = scrollPercent + '%';
        progressGlow.style.width = scrollPercent + '%';
    }
}



// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar();
    initReportButton();
    initIntelligenceEffects();
    initActiveMenuItem();
});

// Initialize active menu item on page load
function initActiveMenuItem() {
    const menuLinks = document.querySelectorAll('.menu a');
    const sections = menuLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    
    // Check if user is at bottom of page
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    
    if (currentScrollY + windowHeight >= documentHeight - 100) {
        // User is at bottom, highlight last section
        menuLinks.forEach((link, index) => {
            if (index === menuLinks.length - 1) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        return;
    }
    
    // Find which section is currently most visible
    let activeIndex = 0;
    let maxVisibleArea = 0;
    
    sections.forEach((section, index) => {
        if (section) {
            const rect = section.getBoundingClientRect();
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(window.innerHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            if (visibleHeight > maxVisibleArea) {
                maxVisibleArea = visibleHeight;
                activeIndex = index;
            }
        }
    });
    
    // Set initial active menu item
    menuLinks.forEach((link, index) => {
        if (index === activeIndex) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

window.addEventListener('scroll', updateProgressBar);

// Burger menu functionality
const burger = document.getElementById('burger');
const menu = document.getElementById('navigation');
if (burger && menu) {
    // Function to update mobile menu when opened
    function updateMobileMenu() {
        if (menu.classList.contains('open')) {
            // Copy active state from desktop menu to mobile menu
            const desktopLinks = document.querySelectorAll('.menu a');
            const mobileLinks = menu.querySelectorAll('a');
            
            desktopLinks.forEach((desktopLink, index) => {
                if (mobileLinks[index]) {
                    if (desktopLink.hasAttribute('aria-current')) {
                        mobileLinks[index].setAttribute('aria-current', 'page');
                    } else {
                        mobileLinks[index].removeAttribute('aria-current');
                    }
                }
            });
        }
    }
    
    // Toggle menu on burger click
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        
        // Update mobile menu when opening
        if (isOpen) {
            updateMobileMenu();
        }
    });
    
    // Close menu when clicking on menu links
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            // Clear mobile menu highlights when closing
            menuLinks.forEach(l => l.removeAttribute('aria-current'));
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !burger.contains(e.target)) {
            menu.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            menu.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            // Clear mobile menu highlights when closing
            menuLinks.forEach(l => l.removeAttribute('aria-current'));
        }
    });
    
    // Update mobile menu on scroll when it's open
    window.addEventListener('scroll', () => {
        if (menu.classList.contains('open')) {
            updateMobileMenu();
        }
    });
}

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Quick contact form with security enhancements
const form = document.getElementById('quick-form');
if (form) {
  // Generate CSRF token
  const csrfToken = document.getElementById('csrf-token');
  if (csrfToken) {
    csrfToken.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = /** @type {HTMLInputElement|null} */(document.getElementById('replyEmail'));
    const message = /** @type {HTMLTextAreaElement|null} */(document.getElementById('message'));
    const csrf = /** @type {HTMLInputElement|null} */(document.getElementById('csrf-token'));
    const submitBtn = /** @type {HTMLButtonElement|null} */(document.getElementById('submit-btn'));
    
    if (!email || !message || !csrf || !submitBtn) return;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
      // Sanitize inputs
      const emailValue = email.value.trim();
      const messageValue = message.value.trim();
      
      if (!emailValue || !messageValue) {
        showToast('נא למלא את כל השדות.', 'error');
        return;
      }
      
      // Enhanced email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        showToast('נא להזין כתובת דוא״ל תקינה.', 'error');
        email.focus();
        return;
      }
      
      // Check for suspicious content
      const suspiciousPatterns = /<script|javascript:|on\w+\s*=/i;
      if (suspiciousPatterns.test(messageValue)) {
        showToast('ההודעה מכילה תוכן לא מורשה.', 'error');
        return;
      }
      
      // Basic email validity check leverages browser validation
      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }
      
      // Simulate form submission with security token
      console.log('Form submitted with CSRF token:', csrf.value);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('תודה, ההודעה התקבלה בהצלחה!', 'success');
      form.reset();
      
      // Regenerate CSRF token
      if (csrf) {
        csrf.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('אירעה שגיאה בשליחת ההודעה. נא לנסות שוב.', 'error');
    } finally {
      // Reset loading state
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
}

// Reveal-on-scroll
(function(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Плавные анимации отключаем согласно настройкам пользователя
        document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.remove('reveal-on-scroll'));
        return;
    }
    const groups = document.querySelectorAll('[data-reveal-group]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.remove('reveal-on-scroll');
            // добавим классы анимации
            el.classList.add('reveal');
            const delay = el.dataset.delay || '0';
            el.classList.add(`delay-${delay}`);
            io.unobserve(el);
        });
    }, { root: null, threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    groups.forEach(group => {
        const items = Array.from(group.querySelectorAll('.reveal-on-scroll'));
        items.forEach((el, i) => {
            // задержка 0..4 по кругу: 0,1,2,3,4,0,1...
            el.dataset.delay = (i % 5).toString();
            io.observe(el);
        });
    });
})();


// Unified scrollspy for desktop menu
const links = [...document.querySelectorAll('.menu a')];
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  let isScrolling = false;
  let scrollTimeout;
  
  function updateActiveMenuItem() {
      // Only update if mobile menu is closed
      if (!menu || !menu.classList.contains('open')) {
          const currentScrollY = window.scrollY;
          const documentHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          
          // If user is near bottom of page, highlight last section
          if (currentScrollY + windowHeight >= documentHeight - 100) {
              links.forEach(l => l.removeAttribute('aria-current'));
              if (links[links.length - 1]) {
                  links[links.length - 1].setAttribute('aria-current', 'page');
              }
              return;
          }
          
          // Find which section is currently most visible
          let activeIndex = 0;
          let maxVisibleArea = 0;
          
          sections.forEach((section, index) => {
              if (section) {
                  const rect = section.getBoundingClientRect();
                  const visibleTop = Math.max(0, rect.top);
                  const visibleBottom = Math.min(window.innerHeight, rect.bottom);
                  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                  
                  if (visibleHeight > maxVisibleArea) {
                      maxVisibleArea = visibleHeight;
                      activeIndex = index;
                  }
              }
          });
          
          // Update active menu item
          links.forEach((link, index) => {
              if (index === activeIndex) {
                  link.setAttribute('aria-current', 'page');
              } else {
                  link.removeAttribute('aria-current');
              }
          });
      }
  }
  
  // Throttled scroll listener
  window.addEventListener('scroll', () => {
      if (!isScrolling) {
          requestAnimationFrame(() => {
              updateActiveMenuItem();
              isScrolling = false;
          });
          isScrolling = true;
      }
      
      // Clear timeout and set new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
          updateActiveMenuItem();
      }, 150);
  });
}

// Straight grid pulses disabled per user request; keeping only chaotic walkers.

// ===== Chaotic small walkers along the grid =====
(function(){
  const container = document.querySelector('.pulses');
  const hero = document.querySelector('.hero');
  if (!container || !hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  const GRID = 32;
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
  });

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

  const MAX_CONCURRENT = 8;
  let live = 0;

  function spawnWalker(){
    if (!running) return schedule();
    if (live >= MAX_CONCURRENT) return schedule();
    live++;

    const rect = hero.getBoundingClientRect();
    const cols = Math.floor(rect.width / GRID);
    const rows = Math.floor(rect.height / GRID);

    // start at random grid node (avoid borders)
    let gx = Math.floor(rand(1, Math.max(2, cols-1)));
    let gy = Math.floor(rand(1, Math.max(2, rows-1)));

    const el = document.createElement('div');
    el.className = 'walker tail';

    const place = () => {
      el.style.transform = `translate(${gx*GRID}px, ${gy*GRID}px)`;
    };
    place();

    const centerDim = () => {
      const py = gy*GRID;
      if (py > rect.height*0.35 && py < rect.height*0.65) el.classList.add('dim'); else el.classList.remove('dim');
    };
    centerDim();

    container.appendChild(el);

    const DIRS = [ [1,0], [-1,0], [0,1], [0,-1] ];
    let lastDir = pick(DIRS);
    let stepsLeft = Math.floor(rand(6, 18));

    const tick = () => {
      if (!running || stepsLeft-- <= 0) return destroy();

      const candidates = DIRS.filter(([dx,dy]) => !(dx === -lastDir[0] && dy === -lastDir[1]));
      const weighted = Math.random() < 0.6 ? [lastDir, ...candidates] : candidates;
      let [dx,dy] = pick(weighted);

      const tryDirs = [ [dx,dy], ...DIRS.filter(d => d!==dx && d!==dy) ];
      let nx = gx, ny = gy, chosen = null;
      for (const [tx,ty] of tryDirs){
        const cx = gx + tx, cy = gy + ty;
        if (cx >= 1 && cx <= cols-1 && cy >= 1 && cy <= rows-1){ chosen = [tx,ty]; nx = cx; ny = cy; break; }
      }
      if (!chosen){ return destroy(); }

      lastDir = chosen;
      gx = nx; gy = ny;

      const dur = rand(0.12, 0.22);
      el.style.transition = `transform ${dur}s linear, opacity ${dur}s linear`;
      el.style.transform = `translate(${gx*GRID}px, ${gy*GRID}px)`;
      centerDim();

      if (Math.random() < 0.06) stepsLeft = 0;
      setTimeout(tick, dur*1000 + 10);
    };

    const destroy = () => {
      el.style.transition = 'opacity .25s ease';
      el.style.opacity = '0';
      setTimeout(() => { el.remove(); live--; }, 260);
    };

    setTimeout(tick, rand(40, 140));
  }

  function schedule(){
    setTimeout(spawnWalker, rand(900, 2200));
  }

  for (let i=0;i<2;i++) setTimeout(spawnWalker, rand(300, 900));
  schedule();
})();

// Report Button functionality
function initReportButton() {
    const reportBtn = document.querySelector('.report-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Show toast notification
            showToast('הפניה לסקציית צור קשר', 'info');
        });
    }
}

// Clean Mossad-style effects
function initIntelligenceEffects() {
    // Simple, clean effects only
    console.log('Clean Mossad-style effects initialized');
}
