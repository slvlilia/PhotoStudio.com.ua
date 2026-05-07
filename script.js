/* ================================================================
   script.js — PhotoStudio
   Глобальний JavaScript для всього сайту
   Підключати перед </body> кожної HTML-сторінки:
   <script src="js/script.js"></script>
   ================================================================ */


/* ================================================================
   1. МОБІЛЬНЕ МЕНЮ (бургер)
   ================================================================ */
(function initMobileMenu() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    if (!burger || !navLinks) return;

    burger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
    });

    // Закрити меню при кліку на посилання
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Закрити меню при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            burger.classList.remove('open');
        }
    });
})();


/* ================================================================
   2. НАВІГАЦІЯ — ефект при скролі
   ================================================================ */
(function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // перевірити одразу при завантаженні
})();


/* ================================================================
   3. АКТИВНИЙ ПУНКТ НАВІГАЦІЇ
   Автоматично підсвічує поточну сторінку
   ================================================================ */
(function initActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    const current = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
})();


/* ================================================================
   4. АНІМАЦІЯ ПОЯВИ ПРИ СКРОЛІ (Intersection Observer)
   Всі елементи з класом .fade-in плавно з'являються
   ================================================================ */
(function initFadeIn() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));

    // Stagger-затримки для карток послуг
    document.querySelectorAll('.services-grid .service-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 80}ms`;
    });

    // Stagger-затримки для галереї
    document.querySelectorAll('.gallery-grid .gallery-item, .portfolio-preview .portfolio-item').forEach((item, i) => {
        item.style.transitionDelay = `${i * 60}ms`;
    });
})();


/* ================================================================
   5. ФІЛЬТРАЦІЯ ГАЛЕРЕЇ (сторінка portfolio.html)
   ================================================================ */
(function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Активна кнопка
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                const category = item.dataset.category;
                const show = filter === 'all' || category === filter;

                if (show) {
                    item.style.display = '';
                    // невелика затримка для анімації
                    requestAnimationFrame(() => item.classList.add('visible'));
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible');
                }
            });
        });
    });
})();


/* ================================================================
   6. ЛАЙТБОКС (перегляд фото у збільшеному вигляді)
   ================================================================ */
(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    if (!lightbox || !lbImg) return;

    let items = [];
    let current = 0;

    // Зібрати всі зображення галереї
    const updateItems = () => {
        items = Array.from(document.querySelectorAll('.gallery-item img'));
    };

    const openLightbox = (index) => {
        updateItems();
        current = index;
        lbImg.src = items[current].src;
        lbImg.alt = items[current].alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        lbImg.src = '';
    };

    const showPrev = () => {
        current = (current - 1 + items.length) % items.length;
        lbImg.src = items[current].src;
    };

    const showNext = () => {
        current = (current + 1) % items.length;
        lbImg.src = items[current].src;
    };

    // Клік по зображенню
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Закрити
    lbClose && lbClose.addEventListener('click', closeLightbox);
    lbPrev && lbPrev.addEventListener('click', showPrev);
    lbNext && lbNext.addEventListener('click', showNext);

    // Закрити кліком на фон
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Клавіатура
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
})();


/* ================================================================
   7. ФОРМА БРОНЮВАННЯ (сторінка booking.html)
   ================================================================ */
(function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    // ── Валідація одного поля ──────────────────────────────────
    const validateField = (field) => {
        const group = field.closest('.form-group');
        if (!group) return true;

        const value = field.value.trim();
        let isValid = true;

        // Обов'язкове поле
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email
        if (field.type === 'email' && value) {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        // Телефон (мінімум 10 цифр)
        if (field.type === 'tel' && value) {
            isValid = /^\+?[\d\s\-\(\)]{10,}$/.test(value);
        }

        group.classList.toggle('error', !isValid);
        return isValid;
    };

    // ── Валідація в реальному часі ─────────────────────────────
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.form-group')?.classList.contains('error')) {
                validateField(field);
            }
        });
    });

    // ── Відправка форми ────────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Валідувати всі поля
        const fields = form.querySelectorAll('input, select, textarea');
        let allValid = true;

        fields.forEach(field => {
            if (!validateField(field)) allValid = false;
        });

        if (!allValid) return;

        // ── Симуляція відправки (замінити на реальний fetch/API) ──
        const submitBtn = form.querySelector('[type="submit"]');
        const origText = submitBtn.textContent;

        submitBtn.textContent = 'Надсилаємо…';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;

            // Показати успіх
            const successMsg = document.getElementById('formSuccess');
            if (successMsg) successMsg.classList.add('visible');

            form.reset();

            // Прокрутити до повідомлення
            successMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Прибрати через 6 секунд
            setTimeout(() => successMsg?.classList.remove('visible'), 6000);
        }, 1200);

        /*
        ── Реальна відправка через Formspree (розкоментуй): ──────
        fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        })
        .then(res => {
          if (res.ok) {
            document.getElementById('formSuccess')?.classList.add('visible');
            form.reset();
          }
        })
        .catch(err => console.error('Помилка відправки:', err))
        .finally(() => {
          submitBtn.textContent = origText;
          submitBtn.disabled    = false;
        });
        */
    });
})();


/* ================================================================
   8. ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ (сторінка contacts.html)
   ================================================================ */
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('[type="submit"]');
        const origText = btn.textContent;
        btn.textContent = 'Надсилаємо…';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = origText;
            btn.disabled = false;

            const msg = document.getElementById('contactSuccess');
            if (msg) {
                msg.classList.add('visible');
                setTimeout(() => msg.classList.remove('visible'), 5000);
            }
            form.reset();
        }, 1000);
    });
})();


/* ================================================================
   9. ПЛАВНА ПРОКРУТКА для anchor-посилань (#section)
   ================================================================ */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80; // висота nav
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();


/* ================================================================
   10. ЛІЧИЛЬНИК СТАТИСТИКИ (анімація цифр у hero)
   ================================================================ */
(function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animate = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('uk-UA');
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
})();


/* ================================================================
   11. ПОВЕРНЕННЯ ВГОРУ (кнопка scroll-to-top)
   ================================================================ */
(function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* ================================================================
   12. ПОТОЧНИЙ РІК у footer
   Автоматично оновлює рік щоб не правити вручну
   ================================================================ */
(function initYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
})();