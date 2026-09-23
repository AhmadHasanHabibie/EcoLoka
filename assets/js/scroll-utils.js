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
   * Mendaftarkan listener scroll yang HANYA aktif saat elemen berada
   * dekat/di dalam viewport (+ buffer 300px) demi efisiensi konsumsi daya,
   * dengan throttling via requestAnimationFrame (60fps mulus).
   * 
   * @param {HTMLElement} element - Elemen yang diobservasi
   * @param {Function} callback - Menerima parameter progress (0..1)
   * @param {number} targetViewportFraction - Titik target (default 0.5)
   */
  bindScrollProgress(element, callback, targetViewportFraction = 0.5) {
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

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const progress = ScrollUtils.calculateViewportProgress(
            element,
            targetViewportFraction
          );
          callback(progress);
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
      { rootMargin: '300px 0px 300px 0px' }
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
      { rootMargin: '200px 0px 200px 0px' }
    );

    observer.observe(element);
  }
};

