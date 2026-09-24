/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KAMPANYE KOMUNITAS & HUTAN TUMBUH
 * File: assets/js/animasi-kampanye-komunitas.js
 * ==========================================================================
 * Setiap kartu kampanye di halaman Komunitas mendapat animasi entrance
 * (fade + slide) DAN animasi hutan kecil tumbuh di bagian bawah kartu,
 * dengan progress yang DIHITUNG SENDIRI oleh masing-masing kartu (per-card).
 *
 * Optimasi Responsivitas & Performa:
 * - Pivot adaptif (0.42 di mobile, 0.46 di tablet, 0.5 di desktop)
 * - will-change dinamis pada kartu dan pohon, dilepas setelah animasi selesai
 * ==========================================================================
 */

(function () {
  const isSupported =
    'IntersectionObserver' in window && 'requestAnimationFrame' in window;
  if (!isSupported) return;

  // Pastikan ScrollUtils telah dimuat
  if (typeof ScrollUtils === 'undefined') {
    console.warn('ScrollUtils belum terdefinisi. Pastikan scroll-utils.js dimuat sebelum skrip ini.');
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const kartuList = Array.from(document.querySelectorAll('.kampanye-card'));
  if (kartuList.length === 0) return;

  kartuList.forEach((kartu) => {
    const pohonList = Array.from(kartu.querySelectorAll('.pohon-tumbuh'));

    if (prefersReducedMotion) {
      kartu.style.opacity = 1;
      kartu.style.transform = 'translateY(0)';
      kartu.style.willChange = 'auto';
      pohonList.forEach((pohon) => {
        pohon.style.transform = 'scaleY(1)';
        pohon.style.willChange = 'auto';
      });
      return;
    }

    // Set kondisi awal TERSEMBUNYI via JS (progressive enhancement)
    kartu.style.opacity = 0;
    kartu.style.transform = 'translateY(28px)';
    pohonList.forEach((pohon) => (pohon.style.transform = 'scaleY(0)'));

    function updateKartu(progress) {
      if (progress > 0 && progress < 1) {
        kartu.style.willChange = 'opacity, transform';
      } else {
        kartu.style.willChange = 'auto'; // Bebaskan layer GPU
      }

      // --- FASE 1 (0 - 0.5): kartu fade + slide masuk ---
      const progressKartu = ScrollUtils.easeOutCubic(
        Math.min(progress / 0.5, 1)
      );
      kartu.style.opacity = progressKartu;
      kartu.style.transform = `translateY(${ScrollUtils.lerp(28, 0, progressKartu)}px)`;

      // --- FASE 2 (0.3 - 1.0): pohon tumbuh stagger ---
      const progressHutanMentah = (progress - 0.3) / 0.7;
      const progressHutan = Math.max(0, Math.min(1, progressHutanMentah));

      pohonList.forEach((pohon, index) => {
        if (progressHutan > 0 && progressHutan < 1) {
          pohon.style.willChange = 'transform';
        } else {
          pohon.style.willChange = 'auto';
        }
        const staggerDelay = index * 0.1;
        let p = (progressHutan - staggerDelay) / (1 - staggerDelay || 1);
        p = ScrollUtils.easeOutCubic(Math.max(0, Math.min(1, p)));
        pohon.style.transform = `scaleY(${p})`;
      });
    }

    // Pivot adaptif per perangkat
    const pivot = ScrollUtils.dapatkanPivotAdaptif();
    ScrollUtils.bindScrollProgress(kartu, updateKartu, pivot);
    updateKartu(ScrollUtils.calculateViewportProgress(kartu, pivot));
  });
})();
