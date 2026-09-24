/**
 * ==========================================================================
 * ECOLOKA — CORE JAVASCRIPT (main.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Arsitektur: 100% Client-Side Vanilla JavaScript (Zero Framework / Library Terlarang)
 * ==========================================================================
 * 
 * DAFTAR FITUR INTERAKTIVITAS TAHAP 1 (FONDASI):
 * 1. Mobile Navigation Toggle & Drawer Controller (Aksesibel WCAG)
 * 2. Sticky Header Elevation on Scroll (Performance Optimized via rAF)
 * 3. Accessible Keyboard Navigation (Escape key, Outside click)
 * 4. Offset Smooth Scrolling untuk Anchor Links
 * 5. Dynamic Footer Copyright Year
 * 6. Scrollspy Active Navigation Indicator
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi seluruh modul fondasi dan penyempurnaan Tahap 3
  initStickyHeader();
  initMobileNavigation();
  initSmoothScroll();
  initDynamicYear();
  initScrollspy();
  initScrollReveal();
  initVisitorCounter();
  initCertificateModal();
  logArchitectureInfo();
});

/**
 * --------------------------------------------------------------------------
 * 1. STICKY HEADER DENGAN OPTIMASI SCROLL (REQUEST ANIMATION FRAME)
 * --------------------------------------------------------------------------
 * Mengubah visual navbar saat pengguna menggulir ke bawah (menambahkan shadow,
 * menurunkan padding, dan mengaktifkan glassmorphism). Menggunakan rAF agar
 * tidak terjadi layout thrashing dan berjalan mulus pada 60fps.
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let isTicking = false;
  const SCROLL_THRESHOLD = 30; // Pixel ambang batas untuk mengaktifkan sticky state

  const handleScroll = () => {
    const currentScrollY = window.scrollY || window.pageYOffset;
    
    if (currentScrollY > SCROLL_THRESHOLD) {
      if (!header.classList.contains('header--scrolled')) {
        header.classList.add('header--scrolled');
      }
    } else {
      if (header.classList.contains('header--scrolled')) {
        header.classList.remove('header--scrolled');
      }
    }
    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(handleScroll);
      isTicking = true;
    }
  }, { passive: true });

  // Panggil sekali di awal untuk status reload halaman di tengah
  handleScroll();
}

/**
 * --------------------------------------------------------------------------
 * 2. MOBILE NAVIGATION DRAWER & AKSESIBILITAS WCAG
 * --------------------------------------------------------------------------
 * Mengontrol pembukaan & penutupan menu mobile dengan dukungan:
 * - Update state `aria-expanded` untuk pembaca layar (screen reader)
 * - Penutupan otomatis saat klik di luar menu (overlay)
 * - Penutupan dengan tombol ESC di keyboard
 * - Penguncian scroll latar belakang saat drawer aktif
 */
function initMobileNavigation() {
  const navToggle = document.querySelector('.navbar__toggle, .navbar__tombol-hamburger');
  const navMenu = document.querySelector('.navbar__nav, .navbar__menu');
  const navOverlay = document.querySelector('.navbar__overlay');
  const navLinks = document.querySelectorAll('.navbar__link');

  if (!navToggle || !navMenu) return;

  // Fungsi toggle menu
  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('is-open');

    navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    navMenu.classList.toggle('is-open', shouldOpen);

    if (navOverlay) {
      navOverlay.classList.toggle('is-visible', shouldOpen);
    }

    // Kunci scroll halaman pada mode mobile agar pengguna fokus pada menu
    document.body.style.overflow = shouldOpen ? 'hidden' : '';

    if (shouldOpen) {
      // Fokuskan link pertama pada menu untuk navigasi keyboard
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      navToggle.focus();
    }
  };

  // Event klik hamburger button
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  // Event klik overlay latar belakang
  if (navOverlay) {
    navOverlay.addEventListener('click', () => toggleMenu(false));
  }

  // Event klik setiap navigasi link (tutup menu setelah dipilih)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        toggleMenu(false);
      }
    });
  });

  // Aksesibilitas keyboard: Tutup menu saat menekan tombol Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });

  // Responsivitas: Bersihkan status mobile saat jendela di-resize ke desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
    }
  }, { passive: true });
}

/**
 * --------------------------------------------------------------------------
 * 3. SMOOTH SCROLLING DENGAN OFFSET HEADER STICKY
 * --------------------------------------------------------------------------
 * Memastikan perataan scroll ke ID target tidak tertutup oleh navbar sticky.
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();

        const header = document.querySelector('.header');
        const headerOffset = header ? header.offsetHeight + 16 : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set focus ke elemen untuk aksesibilitas tab navigasi
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 4. DYNAMIC YEAR IN FOOTER
 * --------------------------------------------------------------------------
 * Memperbarui angka tahun hak cipta secara otomatis tanpa hardcoding.
 */
function initDynamicYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * --------------------------------------------------------------------------
 * 5. SCROLLSPY (ACTIVE NAVIGATION INDICATOR)
 * --------------------------------------------------------------------------
 * Mengamati section mana yang sedang berada di viewport dan memberikan
 * class `.is-active` pada navigasi terkait.
 */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('is-active');
          } else if (href.startsWith('#')) {
            link.classList.remove('is-active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
}

/**
 * --------------------------------------------------------------------------
 * 6. LOG KEPATUHAN & ARSITEKTUR KARYA (CONSOLE BADGE)
 * --------------------------------------------------------------------------
 * Informasi transparan arsitektur sistem bagi penguji / dewan juri.
 */
function logArchitectureInfo() {
  const styleTitle = 'color: #74C69D; font-size: 14px; font-weight: bold; background: #1B4332; padding: 4px 10px; border-radius: 4px;';
  const styleInfo = 'color: #2D6A4F; font-size: 11px;';
  
  console.log('%c🌿 EcoLoka — INVENTION 2026', styleTitle);
  console.log('%cSubtema: Going Green Through Smart Digital Solutions', styleInfo);
  console.log('%cKepatuhan Arsitektur: 100% Client-Side Static (No DB, No Node/PHP Backend, Vanilla JS Only)', styleInfo);
}

/**
 * --------------------------------------------------------------------------
 * 7. SCROLL REVEAL OBSERVER (60FPS ANIMASI TANPA LAYOUT SHIFT)
 * --------------------------------------------------------------------------
 * Memunculkan elemen dengan transisi halus saat masuk ke viewport.
 * Mematuhi preferensi pengguna (prefers-reduced-motion: reduce).
 */
function initScrollReveal() {
  // Cek preferensi reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!revealElements.length) return;

  if (prefersReduced) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Unobserve agar animasi hanya berjalan satu kali dan tidak re-trigger
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * --------------------------------------------------------------------------
 * 8. EASTER EGG: COUNTER PENGUNJUNG HIJAU SIMULATIF
 * --------------------------------------------------------------------------
 * Menampilkan jumlah simbolis pengunjung yang peduli lingkungan hari ini.
 */
function initVisitorCounter() {
  const counterEls = document.querySelectorAll('#counterPejuang, #visitor-count-number, .visitor-counter-val');
  if (counterEls.length === 0) return;

  const BASE_COUNT = 3482;
  let storedCount = BASE_COUNT;

  try {
    const saved = localStorage.getItem('ecoloka_visitor_seed');
    if (saved) {
      storedCount = parseInt(saved, 10);
    } else {
      storedCount = BASE_COUNT + Math.floor(Math.random() * 15) + 1;
      localStorage.setItem('ecoloka_visitor_seed', storedCount.toString());
    }
  } catch (e) {}

  const formatted = storedCount.toLocaleString('id-ID');
  counterEls.forEach((el) => {
    el.textContent = formatted;
  });
}

/**
 * --------------------------------------------------------------------------
 * 9. SIGNATURE TOUCH: MODAL SERTIFIKAT DIGITAL AKSI HIJAU
 * --------------------------------------------------------------------------
 * Membuka modal sertifikat personal yang siap dicetak atau disimpan ke PDF via window.print().
 */
function initCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  const closeBtn = document.getElementById('cert-modal-close');
  const printBtn = document.getElementById('btn-print-certificate');
  const recipientInput = document.getElementById('cert-input-name');
  const recipientDisplay = document.getElementById('cert-display-name');

  if (!modal) return;

  // Update nama secara real-time saat diketik
  if (recipientInput && recipientDisplay) {
    recipientInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      recipientDisplay.textContent = val || 'Pejuang Aksi Hijau';
    });
  }

  // Tombol Cetak / Simpan PDF
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Handler Global untuk Membuka Sertifikat
  window.openEcoCertificate = function(data) {
    const modal = document.getElementById('certificate-modal');
    if (!modal) return;

    const certScore = document.getElementById('cert-display-score');
    const certTier = document.getElementById('cert-display-tier');
    const certDate = document.getElementById('cert-display-date');
    const certCode = document.getElementById('cert-display-code');

    if (certScore && data.score) certScore.textContent = `${data.score.toLocaleString('id-ID')} kg CO₂e/thn`;
    if (certTier && data.tier) certTier.textContent = data.tier;
    if (certDate) {
      certDate.textContent = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
    }
    if (certCode) {
      const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
      certCode.textContent = `ECOLOKA-INV26-${randomHash}`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (recipientInput) recipientInput.focus();
  };
}

