/**
 * ==========================================================================
 * ECOLOKA — SCROLL UTILITIES (scroll-utils.js)
 * Utilitas bersama untuk animasi scroll-linked di seluruh situs EcoLoka.
 * Dipakai oleh: animasi-3r.js, animasi-kartu-statistik.js, dan modul scroll-linked lainnya.
 * 
 * Kepatuhan: 100% Native Browser API (IntersectionObserver + requestAnimationFrame)
 * Zero External Animation Library (Tanpa GSAP, ScrollTrigger, AOS, dll).
 * ==========================================================================
 */

const ScrollUtils = {
  /**
   * Menghitung progress (0..1) berdasarkan jarak titik tengah elemen
   * terhadap titik target viewport. progress = 1 saat titik tengah elemen
   * tepat berada di titik target layar. Nilai di-clamp agar stabil setelah
   * elemen melewati titik target (hasil akhir animasi tetap terkunci rapi).
   * 
   * @param {HTMLElement} element - Elemen DOM yang dihitung posisinya
   * @param {number} targetViewportFraction - Fraksi tinggi viewport (default 0.5 = tengah layar)
   * @returns {number} Progress ter-clamp antara 0.0 dan 1.0
   */
  calculateViewportProgress(element, targetViewportFraction = 0.5) {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const elementCenterY = rect.top + rect.height / 2;
    const viewportHeight = window.innerHeight;
    const targetY = viewportHeight * targetViewportFraction;

    const totalTravel = viewportHeight - targetY;
    if (totalTravel <= 0) return 1;

    const traveled = viewportHeight - elementCenterY;
    const progress = traveled / totalTravel;

    return Math.max(0, Math.min(1, progress));
  },

  /**
   * Interpolasi linear sederhana: lerp(start, end, t)
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * Easing halus (Ease-Out Cubic)
   * Gerakan lebih responsif dan dinamis di awal, melambat natural mendekati akhir.
   */
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },

  /**
   * Easing dengan sedikit "overshoot" halus (melewati posisi akhir sedikit,
   * lalu mengendap kembali) — memberi kesan "mendarat" yang hidup, seperti
   * kertas ringan yang melayang lalu menetap, TANPA terasa memantul kasar.
   * Konstanta c1 sengaja dibuat kecil (0.5) agar efeknya sangat subtle,
   * sesuai kebutuhan animasi yang "sangat smooth".
   */
  easeOutBackSubtle(t) {
    const c1 = 0.5;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  /**
   * Deteksi kelas perangkat berdasarkan lebar viewport
   * Breakpoint acuan: 360px | 480px | 768px | 1024px | 1280px | 1440px
   */
  getKelasPerangkat() {
    const lebar = window.innerWidth;
    if (lebar < 480) return 'mobile';
    if (lebar < 768) return 'mobile-lebar';
    if (lebar < 1024) return 'tablet';
    return 'desktop';
  },

  /**
   * Deteksi kapabilitas input layar sentuh
   */
  isPerangkatSentuh() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  },

  /**
   * Deteksi sinyal perangkat berperforma rendah (hemat baterai & CPU HP menengah-bawah)
   */
  isPerformaRendah() {
    const coreSedikit = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const hematData = navigator.connection && navigator.connection.saveData;
    return Boolean(coreSedikit || hematData);
  },

  /**
   * Pivot Trigger Adaptif per Perangkat:
   * Di HP, area fokus baca & jempol pengguna lebih ke atas, sehingga
   * animasi dipicu sedikit lebih awal (0.42 / 0.46) agar langsung terlihat mulus.
   */
  dapatkanPivotAdaptif() {
    const kelas = ScrollUtils.getKelasPerangkat();
    if (kelas === 'mobile') return 0.42;
    if (kelas === 'mobile-lebar') return 0.46;
    return 0.5; // tablet & desktop tetap viewport-center
  },

  /**
   * Alias hitungProgress terintegrasi pivot adaptif
   */
  hitungProgress(element, targetViewportFraction = null) {
    const pivot = (targetViewportFraction !== null && targetViewportFraction !== undefined)
      ? targetViewportFraction
      : ScrollUtils.dapatkanPivotAdaptif();
    return ScrollUtils.calculateViewportProgress(element, pivot);
  },

  /**
   * Debounce utilitas untuk event padat seperti window resize / orientasi
   */
  debounce(fn, tunda = 200) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), tunda);
    };
  },

  /**
   * Gerbang visibilitas: animasi HANYA berjalan ketika elemen berada
   * di dalam viewport (+ margin buffer), dan berhenti total saat di luar layar.
   */
  pasangGerbangVisibilitas(elemen, mulaiFn, hentikanFn, margin = '20% 0px 20% 0px') {
    if (!('IntersectionObserver' in window)) {
      mulaiFn();
      return null;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mulaiFn();
          } else {
            hentikanFn();
          }
        });
      },
      { rootMargin: margin }
    );
    observer.observe(elemen);
    return observer;
  },

  /**
   * Mendaftarkan listener scroll yang HANYA aktif saat elemen berada
   * dekat/di dalam viewport (+ buffer 20%) demi efisiensi konsumsi daya,
   * dengan throttling via requestAnimationFrame + mode hemat low-end hardware.
   * 
   * @param {HTMLElement} element - Elemen yang diobservasi
   * @param {Function} callback - Menerima parameter progress (0..1)
   * @param {number|null} targetViewportFraction - Titik target (default null -> pivot adaptif per device)
   */
  bindScrollProgress(element, callback, targetViewportFraction = null) {
    if (!element || typeof callback !== 'function') return;

    // Aksesibilitas WCAG: Hormati preferensi pengguna yang mematikan gerakan
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      callback(1); // Langsung tampilkan state akhir tanpa animasi
      return;
    }

    let ticking = false;
    let hitungFrame = 0;
    const performaRendah = ScrollUtils.isPerformaRendah();
    const intervalThrottle = performaRendah ? 2 : 1; // Update tiap 2 frame (~30fps) di device lemah

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          hitungFrame++;
          if (hitungFrame % intervalThrottle === 0) {
            const pivot = (targetViewportFraction !== undefined && targetViewportFraction !== null && targetViewportFraction !== 0.5)
              ? targetViewportFraction
              : ScrollUtils.dapatkanPivotAdaptif();
            const progress = ScrollUtils.calculateViewportProgress(
              element,
              pivot
            );
            callback(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });
            onScroll(); // Panggil segera saat masuk viewport
          } else {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);

            // Clamping batas jika pengguna menggulir cepat (flick scroll)
            const rect = element.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
              callback(0); // Berada di bawah layar -> state awal
            } else if (rect.bottom < 0) {
              callback(1); // Berada di atas layar -> state akhir
            }
          }
        });
      },
      { rootMargin: '20% 0px 20% 0px' }
    );

    observer.observe(element);
  },

  /**
   * Memantau DELTA scroll (bukan progress 0-1) selama sebuah elemen berada
   * dekat/di dalam viewport. Berguna untuk efek yang bereaksi terhadap ARAH
   * dan JUMLAH scroll secara langsung, seperti marquee horizontal yang
   * mengikuti arah scroll vertikal.
   * @param {HTMLElement} element - elemen yang diobservasi untuk efisiensi (on/off listener)
   * @param {Function} callback - dipanggil dengan (deltaY) setiap kali ada event scroll relevan
   */
  bindScrollDelta(element, callback) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const deltaY = currentScrollY - lastScrollY;
          lastScrollY = currentScrollY;
          callback(deltaY);
          ticking = false;
        });
        ticking = true;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lastScrollY = window.scrollY; // reset referensi agar tidak "lompat" saat baru masuk viewport
            window.addEventListener('scroll', onScroll, { passive: true });
          } else {
            window.removeEventListener('scroll', onScroll);
          }
        });
      },
      { rootMargin: '20% 0px 20% 0px' }
    );

    observer.observe(element);
  }
};


