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

// Cyberpunk tactical cursor
function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let isMoving = false;
    let scanInterval;
    
    // Create cyberpunk data particle
    function createCyberParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 20 + 10;
        const particleX = Math.cos(angle) * distance;
        const particleY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--particle-x', particleX + 'px');
        particle.style.setProperty('--particle-y', particleY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1500);
    }
    
    // Create cyberpunk data trail
    function createCyberTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-magical-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    }
    
    // Create cyberpunk scan burst
    function createCyberBurst(x, y) {
        for (let i = 0; i < 4; i++) {
            const burst = document.createElement('div');
            burst.className = 'cursor-magical-burst';
            burst.style.left = x + 'px';
            burst.style.top = y + 'px';
            
            // Create burst in crosshair directions
            const angle = (i / 4) * Math.PI * 2;
            const distance = 15;
            const burstX = Math.cos(angle) * distance;
            const burstY = Math.sin(angle) * distance;
            
            burst.style.setProperty('--burst-x', burstX + 'px');
            burst.style.setProperty('--burst-y', burstY + 'px');
            
            document.body.appendChild(burst);
            
            setTimeout(() => {
                if (burst.parentNode) {
                    burst.parentNode.removeChild(burst);
                }
            }, 800);
        }
    }
    
    // Create cyberpunk scan lines
    function createScanLines() {
        for (let i = 0; i < 2; i++) {
            const scanLine = document.createElement('div');
            scanLine.className = 'cursor-sparkle';
            
            // Random position around cursor
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30 + 15;
            const scanX = mouseX + Math.cos(angle) * distance;
            const scanY = mouseY + Math.sin(angle) * distance;
            
            scanLine.style.left = scanX + 'px';
            scanLine.style.top = scanY + 'px';
            
            document.body.appendChild(scanLine);
            
            setTimeout(() => {
                if (scanLine.parentNode) {
                    scanLine.parentNode.removeChild(scanLine);
                }
            }, 2000);
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Calculate movement speed
        const deltaX = mouseX - lastMouseX;
        const deltaY = mouseY - lastMouseY;
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Create cyberpunk effects based on movement
        if (speed > 5) {
            isMoving = true;
            
            // Create cyber trail
            if (Math.random() < 0.6) {
                createCyberTrail(mouseX, mouseY);
            }
            
            // Create cyber particles
            if (Math.random() < 0.3) {
                createCyberParticle(mouseX, mouseY);
            }
        } else {
            isMoving = false;
        }
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15; // Smooth following
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Create scan lines periodically
    scanInterval = setInterval(createScanLines, 3000);
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .card, .btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
    
    // Click effects
    document.addEventListener('mousedown', () => {
        cursorOutline.classList.add('click');
        // Create cyber burst on click
        createCyberBurst(mouseX, mouseY);
    });
    document.addEventListener('mouseup', () => {
        cursorOutline.classList.remove('click');
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (scanInterval) {
            clearInterval(scanInterval);
        }
    });
}

// Enhanced cyber impulse system with grid movement
function initCyberImpulses() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Add electric field background
    const electricField = document.createElement('div');
    electricField.className = 'electric-field';
    container.appendChild(electricField);
    
    // Grid configuration (matching the CSS grid)
    const GRID_SIZE = 50; // matches background-size: 50px 50px
    const gridWidth = Math.ceil(window.innerWidth / GRID_SIZE);
    const gridHeight = Math.ceil(window.innerHeight / GRID_SIZE);
    
    function createCyberImpulse() {
        const impulse = document.createElement('div');
        impulse.className = 'cyber-impulse';
        
        // Random colors
        const colors = ['var(--blue)', 'var(--green)', '#00ffff', '#ff00ff', '#ffff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Start at random grid position
        const startX = Math.floor(Math.random() * gridWidth) * GRID_SIZE;
        const startY = Math.floor(Math.random() * gridHeight) * GRID_SIZE;
        
        // End at random grid position (different from start)
        let endX, endY;
        do {
            endX = Math.floor(Math.random() * gridWidth) * GRID_SIZE;
            endY = Math.floor(Math.random() * gridHeight) * GRID_SIZE;
        } while (endX === startX && endY === startY);
        
        // Set position and animation
        impulse.style.left = startX + 'px';
        impulse.style.top = startY + 'px';
        impulse.style.setProperty('--end-x', (endX - startX) + 'px');
        impulse.style.setProperty('--end-y', (endY - startY) + 'px');
        
        // Set color
        impulse.style.background = color;
        impulse.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}`;
        
        // Random animation duration
        const duration = Math.random() * 2 + 3; // 3-5 seconds
        impulse.style.animationDuration = duration + 's';
        
        container.appendChild(impulse);
        
        // Create trail effect
        createCyberTrail(startX, startY, endX, endY, color, duration);
        
        // Remove impulse after animation
        setTimeout(() => {
            if (impulse.parentNode) {
                impulse.parentNode.removeChild(impulse);
            }
        }, duration * 1000);
    }
    
    function createCyberTrail(startX, startY, endX, endY, color, duration) {
        const steps = Math.floor(duration * 10); // 10 steps per second
        const stepX = (endX - startX) / steps;
        const stepY = (endY - startY) / steps;
        
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                const trail = document.createElement('div');
                trail.className = 'cyber-trail';
                trail.style.left = (startX + stepX * i) + 'px';
                trail.style.top = (startY + stepY * i) + 'px';
                trail.style.background = color;
                trail.style.boxShadow = `0 0 4px ${color}`;
                
                container.appendChild(trail);
                
                setTimeout(() => {
                    if (trail.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                }, 1000);
            }, i * 100);
        }
    }
    
    // Create impulses periodically
    setInterval(createCyberImpulse, 1200);
    
    // Initial impulses
    for (let i = 0; i < 3; i++) {
        setTimeout(createCyberImpulse, i * 1200);
    }
}

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar();
    initCustomCursor();
    initCyberImpulses();
});

window.addEventListener('scroll', updateProgressBar);

// Burger menu functionality
const burger = document.getElementById('burger');
const menu = document.getElementById('navigation');
if (burger && menu) {
    // Function to update active menu item
    function updateActiveMenuItem() {
        const menuLinks = menu.querySelectorAll('a');
        const sections = menuLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
        
        // Find which section is currently in view
        let activeIndex = 0;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            if (section && section.offsetTop <= scrollPosition) {
                activeIndex = index;
            }
        });
        
        // Update aria-current attributes
        menuLinks.forEach((link, index) => {
            if (index === activeIndex) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
    
    // Toggle menu on burger click
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        
        // Update active menu item when opening menu
        if (isOpen) {
            updateActiveMenuItem();
        }
    });
    
    // Close menu when clicking on menu links
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
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
        }
    });
    
    // Update active menu item on scroll
    window.addEventListener('scroll', updateActiveMenuItem);
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


// scrollspy for desktop menu only
const links = [...document.querySelectorAll('.menu a')];
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
          if (e.isIntersecting) {
              // Only update if mobile menu is closed
              if (!menu || !menu.classList.contains('open')) {
                  links.forEach(l => l.removeAttribute('aria-current'));
                  const idx = sections.indexOf(e.target);
                  if (links[idx]) links[idx].setAttribute('aria-current', 'page');
              }
          }
      });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1] });
  sections.forEach(s => spy.observe(s));
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
