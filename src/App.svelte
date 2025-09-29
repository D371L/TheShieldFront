<script>
  import { onMount, tick } from 'svelte';
  import Toast from './lib/Toast.svelte';

  const navItems = [
    { href: '#home', label: 'ראשי' },
    { href: '#mission', label: 'אודות' },
    { href: '#reports', label: 'דוחות' },
    { href: '#contact', label: 'צור קשר' }
  ];

  const logoSrc = `${import.meta.env.BASE_URL}assets/logo.svg`;
  const logoVersionedSrc = `${logoSrc}?v=3`;
  const reportsUrl = `${import.meta.env.BASE_URL}data/reports.json`;

  let activeHash = '#home';
  let menuOpen = false;
  let toasts = [];
  let reports = [];
  let fetchError = false;
  let loading = false;
  let csrfToken = '';

  let replyEmail = '';
  let messageText = '';

  let progressBarEl;
  let progressGlowEl;
  let heroSection;
  let pulsesContainer;
  let navigationEl;
  let burgerButton;
  let reportsContainer;
  let emailInput;
  let messageInput;
  let submitButton;
  let formEl;

  let revealControl;
  let pulsesCleanup = () => {};
  let sectionElements = [];
  let scrollFrame = 0;

  const suspiciousPatterns = /<script|javascript:|on\w+\s*=/i;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function regenerateToken() {
    const randomChunk = () => Math.random().toString(36).slice(2, 15);
    csrfToken = `${randomChunk()}${randomChunk()}`;
  }

  function showToast(message, type = 'info', duration = 5000) {
    const id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => removeToast(id), duration);
  }

  function removeToast(id) {
    toasts = toasts.filter((toast) => toast.id !== id);
  }

  function updateSections() {
    sectionElements = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
  }

  function updateProgressBar() {
    if (!progressBarEl || !progressGlowEl) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const percent = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 100;
    progressBarEl.style.width = `${percent}%`;
    progressGlowEl.style.width = `${percent}%`;
  }

  function updateActiveSection() {
    if (!sectionElements.length) return;

    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const currentScrollY = window.scrollY;

    if (currentScrollY + windowHeight >= documentHeight - 100) {
      activeHash = navItems[navItems.length - 1]?.href ?? activeHash;
      return;
    }

    let activeIndex = 0;
    let maxVisibleArea = 0;

    sectionElements.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(window.innerHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleArea) {
        maxVisibleArea = visibleHeight;
        activeIndex = index;
      }
    });

    activeHash = navItems[activeIndex]?.href ?? activeHash;
  }

  function handleScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateProgressBar();
      updateActiveSection();
    });
  }

  function handleDocumentClick(event) {
    if (!menuOpen) return;
    if (!navigationEl || !burgerButton) return;
    if (!navigationEl.contains(event.target) && !burgerButton.contains(event.target)) {
      menuOpen = false;
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && menuOpen) {
      menuOpen = false;
    }
  }

  function toggleMenu(event) {
    event?.stopPropagation();
    menuOpen = !menuOpen;
  }

  function handleNavClick(href) {
    activeHash = href;
    menuOpen = false;
  }

  function handleReportClick() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('הפניה לסקציית צור קשר', 'info');
    menuOpen = false;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const emailValue = replyEmail.trim();
    const messageValue = messageText.trim();

    if (!emailValue || !messageValue) {
      showToast('נא למלא את כל השדות.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      showToast('נא להזין כתובת דוא״ל תקינה.', 'error');
      emailInput?.focus();
      return;
    }

    if (suspiciousPatterns.test(messageValue)) {
      showToast('ההודעה מכילה תוכן לא מורשה.', 'error');
      return;
    }

    if (emailInput && !emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    loading = true;

    try {
      console.log('Form submitted with CSRF token:', csrfToken);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast('תודה, ההודעה התקבלה בהצלחה!', 'success');
      replyEmail = '';
      messageText = '';
      regenerateToken();
      formEl?.reset?.();
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('אירעה שגיאה בשליחת ההודעה. נא לנסות שוב.', 'error');
    } finally {
      loading = false;
    }
  }

  function createReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.remove('reveal-on-scroll'));
      return { register: () => {}, destroy: () => {} };
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.remove('reveal-on-scroll');
        el.classList.add('reveal');
        const delay = el.dataset.delay || '0';
        el.classList.add(`delay-${delay}`);
        io.unobserve(el);
      });
    }, { root: null, threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    const register = (group) => {
      if (!group) return;
      const items = Array.from(group.querySelectorAll('.reveal-on-scroll'));
      items.forEach((el, index) => {
        el.dataset.delay = (index % 5).toString();
        io.observe(el);
      });
    };

    document.querySelectorAll('[data-reveal-group]').forEach(register);

    return {
      register,
      destroy: () => io.disconnect()
    };
  }

  function initPulses(container, hero) {
    if (!container || !hero) {
      return () => {};
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      return () => {};
    }

    const GRID = 32;
    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const timeouts = new Set();
    const walkerCleanups = new Set();
    let destroyed = false;
    let running = true;

    const hardwareThreads = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
    const lowPowerDevice = hardwareThreads <= 4;
    const compactViewport = window.matchMedia('(max-width: 768px)').matches;
    const maxWalkers = lowPowerDevice ? 1 : (compactViewport ? 2 : 3);
    const spawnRange = lowPowerDevice ? [1200, 2600] : (compactViewport ? [1000, 2200] : [800, 2000]);

    const spawnDelay = () => rand(spawnRange[0], spawnRange[1]);

    const visibilityHandler = () => {
      running = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', visibilityHandler);

    const schedule = (delay = spawnDelay()) => {
      if (destroyed) return;
      const id = setTimeout(() => {
        timeouts.delete(id);
        spawnWalker();
      }, delay);
      timeouts.add(id);
    };

    const spawnWalker = () => {
      if (destroyed) return;
      if (!running) {
        schedule();
        return;
      }

      if (container.childElementCount >= maxWalkers) {
        schedule();
        return;
      }

      const rect = hero.getBoundingClientRect();
      const cols = Math.floor(rect.width / GRID);
      const rows = Math.floor(rect.height / GRID);

      if (cols < 2 || rows < 2) {
        schedule();
        return;
      }

      const el = document.createElement('div');
      el.className = 'walker tail';
      container.appendChild(el);

      let gx = Math.floor(rand(1, Math.max(2, cols - 1)));
      let gy = Math.floor(rand(1, Math.max(2, rows - 1)));
      let stepsLeft = Math.floor(rand(lowPowerDevice ? 4 : 6, lowPowerDevice ? 12 : 18));
      let lastDir = pick(DIRS);

      const localTimeouts = new Set();

      const place = () => {
        el.style.transform = `translate(${gx * GRID}px, ${gy * GRID}px)`;
      };

      const centerDim = () => {
        const py = gy * GRID;
        if (py > rect.height * 0.35 && py < rect.height * 0.65) {
          el.classList.add('dim');
        } else {
          el.classList.remove('dim');
        }
      };

      place();
      centerDim();

      const scheduleLocal = (fn, delay) => {
        const id = setTimeout(() => {
          localTimeouts.delete(id);
          fn();
        }, delay);
        localTimeouts.add(id);
      };

      const cleanup = () => {
        localTimeouts.forEach(clearTimeout);
        el.remove();
        walkerCleanups.delete(cleanup);
      };

      walkerCleanups.add(cleanup);

      const destroyWalker = () => {
        el.style.transition = 'opacity .25s ease';
        el.style.opacity = '0';
        scheduleLocal(() => {
          cleanup();
        }, 260);
      };

      const tickWalker = () => {
        if (destroyed || !running || stepsLeft-- <= 0) {
          destroyWalker();
          return;
        }

        const candidates = DIRS.filter(([dx, dy]) => !(dx === -lastDir[0] && dy === -lastDir[1]));
        const weighted = Math.random() < 0.6 ? [lastDir, ...candidates] : candidates;
        const [preferredDx, preferredDy] = pick(weighted);
        const tryDirs = [[preferredDx, preferredDy], ...DIRS.filter(([dx, dy]) => !(dx === preferredDx && dy === preferredDy))];

        let chosen = null;
        let nx = gx;
        let ny = gy;

        for (const [tx, ty] of tryDirs) {
          const cx = gx + tx;
          const cy = gy + ty;
          if (cx >= 1 && cx <= cols - 1 && cy >= 1 && cy <= rows - 1) {
            chosen = [tx, ty];
            nx = cx;
            ny = cy;
            break;
          }
        }

        if (!chosen) {
          destroyWalker();
          return;
        }

        lastDir = chosen;
        gx = nx;
        gy = ny;

        const duration = rand(0.12, 0.22);
        el.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
        el.style.transform = `translate(${gx * GRID}px, ${gy * GRID}px)`;
        centerDim();

        if (Math.random() < 0.04) {
          stepsLeft = 0;
        }

        scheduleLocal(tickWalker, duration * 1000 + 10);
      };

      scheduleLocal(tickWalker, rand(60, 140));
      schedule();
    };

    for (let i = 0; i < maxWalkers; i += 1) {
      schedule(rand(300, 900));
    }

    return () => {
      destroyed = true;
      document.removeEventListener('visibilitychange', visibilityHandler);
      timeouts.forEach(clearTimeout);
      walkerCleanups.forEach((cleanup) => cleanup());
      container.innerHTML = '';
    };
  }

  async function fetchReports() {
    try {
      const response = await fetch(reportsUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Bad status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        reports = data;
        fetchError = false;
        await tick();
        revealControl?.register(reportsContainer);
        updateSections();
        return;
      }
      fetchError = true;
    } catch (error) {
      console.error('Unable to populate reports:', error);
      fetchError = true;
    } finally {
      await tick();
      revealControl?.register(reportsContainer);
    }
  }

  onMount(async () => {
    regenerateToken();
    await tick();
    updateSections();
    updateProgressBar();
    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleDocumentClick);
    window.addEventListener('keydown', handleKeydown);

    revealControl = createReveal();
    pulsesCleanup = initPulses(pulsesContainer, heroSection);
    fetchReports();

    return () => {
      if (scrollFrame) {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('keydown', handleKeydown);
      revealControl?.destroy();
      pulsesCleanup?.();
    };
  });
</script>

<div class="skip-links">
  <a href="#main-content" class="skip-link">דלג לתוכן הראשי</a>
  <a href="#navigation" class="skip-link">דלג לתפריט</a>
</div>

<div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true">
  {#each toasts as toast (toast.id)}
    <Toast message={toast.message} type={toast.type} />
  {/each}
</div>

<div class="progress-container">
  <div class="progress-bar" id="progress-bar" bind:this={progressBarEl}></div>
  <div class="progress-glow" id="progress-glow" bind:this={progressGlowEl}></div>
</div>

<div class="scan-lines" aria-hidden="true"></div>
<div class="grid-overlay" aria-hidden="true"></div>

<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="#home" aria-label="חזית המגן: שומרי האיזון">
      <img class="brand-logo" src={logoVersionedSrc} alt="חזית המגן: שומרי האיזון" />
      <div class="t"><b>חזית המגן: שומרי האיזון</b></div>
    </a>

    <nav
      class={`menu ${menuOpen ? 'open' : ''}`}
      id="navigation"
      aria-label="תפריט ראשי"
      bind:this={navigationEl}
    >
      {#each navItems as item}
        <a
          href={item.href}
          aria-current={activeHash === item.href ? 'page' : undefined}
          on:click={() => handleNavClick(item.href)}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="header-actions">
      <div class="language-selector">
        <button class="lang-btn active" data-lang="he" aria-label="עברית">עברית</button>
        <button class="lang-btn disabled" data-lang="ar" aria-label="العربية" disabled>العربية</button>
        <button class="lang-btn disabled" data-lang="en" aria-label="English" disabled>English</button>
        <button class="lang-btn disabled" data-lang="ru" aria-label="Русский" disabled>Русский</button>
      </div>

      <button class="report-btn" aria-label="שליחת דיווח" on:click={handleReportClick}>
        <span class="btn-text">שליחת דיווח</span>
        <span class="btn-icon">📊</span>
      </button>
    </div>

    <button
      class="burger"
      id="burger"
      aria-label="פתח/סגור תפריט"
      aria-controls="navigation"
      aria-expanded={menuOpen}
      on:click={toggleMenu}
      bind:this={burgerButton}
    >☰</button>
  </div>
</header>

<main id="home" class="hero" bind:this={heroSection}>
  <div class="pulses" aria-hidden="true" bind:this={pulsesContainer}></div>
  <div class="inner" id="main-content">
    <div class="logo-badge-wrap">
      <img class="logo-badge reveal delay-0" src={logoSrc} alt="חזית המגן" fetchpriority="high" />
    </div>
    <h1 class="reveal delay-1">ברוכים הבאים</h1>
    <p class="lead reveal delay-2">
      ארגון אזרחי בלתי ממשלתי החוקר ואוסף מידע על אנשים וארגונים הפועלים נגד מדינת ישראל, וכן על אנטישמיות, הטרדה מינית וניצול קטינים.
      המידע נאסף ממקורות פתוחים ונועד לסייע לרשויות החוק, לגורמי ביטחון ולציבור בהתמודדות עם איומים על שלום הציבור וביטחון המדינה.
    </p>
    <div class="actions">
      <a class="btn primary reveal delay-3" href="#contact">צור קשר</a>
      <a class="btn ghost reveal delay-4" href="#mission">על המתודולוגיה</a>
    </div>
  </div>
</main>

<section id="mission">
  <div class="wrap">
    <div class="title"><h2>מה אנחנו עושים</h2></div>
    <p class="muted center">
      ארגון אזרחי בלתי תלוי המספק מידע מבוסס עובדות. ללא הטיות פוליטיות או אתניות.
      מתודולוגיה ממוקדת בדיקה, אימות והצלבה.
    </p>
    <div class="cards" data-reveal-group>
      <article class="card reveal-on-scroll"><div class="icon">🛰️</div><h3>איסוף OSINT</h3><p class="muted">כריית נתונים ממקורות גלויים, ניטור נכסים דיגיטליים ותיעוד פומבי.</p></article>
      <article class="card reveal-on-scroll"><div class="icon">🔗</div><h3>ניתוח והצלבות</h3><p class="muted">קישור ישויות, אירועים ותשתיות לכדי תמונת מצב אמינה.</p></article>
      <article class="card reveal-on-scroll"><div class="icon">🤝</div><h3>שיתופי פעולה</h3><p class="muted">מסירת ממצאים לרשויות מוסמכות ולנפגעי עבירה, בהתאם לחוק.</p></article>
      <article class="card reveal-on-scroll"><div class="icon">📑</div><h3>שקיפות ואתיקה</h3><p class="muted">נהלי תיעוד, רישום גרסאות, ותיקונים פומביים כשנדרש.</p></article>
    </div>
  </div>
</section>

<section id="reports">
  <div class="wrap">
    <div class="title"><h2>דוחות אחרונים</h2></div>
    <div class="list" data-reports data-reveal-group bind:this={reportsContainer}>
      {#if fetchError}
        <p class="muted">לא ניתן לטעון את רשימת הדוחות ברגע זה.</p>
      {:else if reports.length === 0}
        <p class="muted">דוחות חדשים יתפרסמו בקרוב.</p>
      {:else}
        {#each reports as report, index}
          <article class="report reveal-on-scroll" data-delay={index % 5}>
            <div>{report.title}</div>
            {#if report.summary}
              <p class="muted">{report.summary}</p>
            {/if}
            <small>{report.date}</small>
          </article>
        {/each}
      {/if}
      <noscript>
        <div class="report"><div>מיפוי תשתיות דיגיטליות סביב אירועי השחתה</div><small>אוג׳ 2025</small></div>
        <div class="report"><div>ניתוח רשתות הפצה של דיסאינפורמציה</div><small>יול׳ 2025</small></div>
        <div class="report"><div>קשרים גלויים בין ארגונים עוינים לגורמי מימון</div><small>יונ׳ 2025</small></div>
      </noscript>
    </div>
  </div>
</section>

<section id="contact">
  <div class="wrap">
    <div class="title"><h2>צור קשר</h2></div>
    <div class="contact">
      <div class="box">
        <h3>דרכי התקשרות</h3>
        <ul>
          <li>דוא״ל: <a href="mailto:soft.wzrgz@passmail.net">soft.wzrgz@passmail.net</a></li>
          <li>טלגרם: <a href="https://t.me/your_channel" target="_blank" rel="noopener">@your_channel</a></li>
          <li>כתובת למשלוח דואר: חיפה, ישראל</li>
        </ul>
      </div>
      <div class="box">
        <h3>הודעה מהירה</h3>
        <form id="quick-form" novalidate autocomplete="on" on:submit={handleSubmit} bind:this={formEl}>
          <input type="hidden" name="csrf_token" id="csrf-token" value={csrfToken} />
          <label for="replyEmail">דוא״ל לחזרה</label>
          <input
            id="replyEmail"
            name="email"
            type="email"
            autocomplete="email"
            required
            placeholder="name@example.com"
            bind:value={replyEmail}
            bind:this={emailInput}
          />
          <label for="message" class="form-label-spaced">הודעה</label>
          <textarea
            id="message"
            name="message"
            required
            bind:value={messageText}
            bind:this={messageInput}
          ></textarea>
          <div class="form-actions">
            <button class={`btn primary ${loading ? 'loading' : ''}`} type="submit" id="submit-btn" bind:this={submitButton} disabled={loading}>
              <span class="btn-text">שליחה</span>
              <span class="btn-loading">שולח...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">© 2024 – 2025 חזית המגן. כל הזכויות שמורות.</div>
</footer>
