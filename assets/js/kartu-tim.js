/**
 * ==========================================================================
 * ECOLOKA — CINCIN DEDIKASI & RIAK KONTRIBUSI (KARTU TIM)
 * File: assets/js/kartu-tim.js
 * ==========================================================================
 * Setiap kartu kolaborator memantau progress-nya SENDIRI-SENDIRI (per-card,
 * bukan per-grid).
 * - Fase 1 (0 -> 0.6): "Cincin Dedikasi" terisi 360° (halo conic-gradient).
 * - Fase 2 (0.55 -> 1): "Riak Kontribusi" mengembang sekali lalu memudar.
 * - Fase 3 (0.4 -> 1): Isi kartu memudar masuk tumpang tindih secara natural.
 *
 * Optimasi Responsivitas & Performa:
 * - Pivot adaptif (0.42 di mobile, 0.46 di tablet, 0.5 di desktop)
 * - Dukungan sentuh (touchstart/touchend) untuk efek hover di mobile
 * - will-change dinamis pada cincin dan riak (bebas GPU memory saat diam)
 * ==========================================================================
 */

(function () {
  const isSupported =
    'IntersectionObserver' in window && 'requestAnimationFrame' in window;
  if (!isSupported) return;

  if (typeof ScrollUtils === 'undefined') {
    console.warn('ScrollUtils belum terdefinisi. Pastikan scroll-utils.js dimuat sebelum skrip ini.');
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const kartuList = Array.from(document.querySelectorAll('.kartu-tim'));
  if (kartuList.length === 0) return;

  // Dukungan interaksi sentuh pada perangkat mobile / layar sentuh
  const perangkatSentuh = ScrollUtils.isPerangkatSentuh();
  if (perangkatSentuh) {
    kartuList.forEach((kartu) => {
      kartu.addEventListener('touchstart', () => {
        kartu.classList.add('kartu-tim--aktif-sentuh');
      }, { passive: true });
      kartu.addEventListener('touchend', () => {
        setTimeout(() => kartu.classList.remove('kartu-tim--aktif-sentuh'), 400);
      }, { passive: true });
    });
  }

  kartuList.forEach((kartu) => {
    const cincin = kartu.querySelector('.kartu-tim__cincin');
    const riak = kartu.querySelector('.kartu-tim__riak');
    const isi = kartu.querySelector('.kartu-tim__isi');
    if (!cincin || !riak || !isi) return;

    if (prefersReducedMotion) {
      kartu.style.setProperty('--sudut-cincin', 360);
      cincin.style.willChange = 'auto';
      riak.style.opacity = 0;
      riak.style.willChange = 'auto';
      isi.style.opacity = 1;
      return;
    }

    kartu.style.setProperty('--sudut-cincin', 0);
    isi.style.opacity = 0;

    function updateKartu(progress) {
      // Fase 1 (0 -> 0.6): cincin dedikasi terisi penuh 360°
      const progressCincin = ScrollUtils.easeOutCubic(
        Math.min(progress / 0.6, 1)
      );
      kartu.style.setProperty(
        '--sudut-cincin',
        Math.round(progressCincin * 360)
      );

      if (progress > 0 && progress < 0.65) {
        cincin.style.willChange = 'background';
      } else {
        cincin.style.willChange = 'auto';
      }

      // Fase 2 (0.55 -> 1): riak kontribusi mengembang sekali lalu memudar
      const progressRiakRaw = (progress - 0.55) / 0.45;
      const progressRiak = Math.max(0, Math.min(1, progressRiakRaw));
      if (progressRiak > 0 && progressRiak < 1) {
        riak.style.willChange = 'transform, opacity';
        const skala = ScrollUtils.lerp(0.8, 2.1, progressRiak);
        riak.style.transform = `scale(${skala})`;
        riak.style.opacity = Math.sin(progressRiak * Math.PI) * 0.6;
      } else {
        riak.style.opacity = 0;
        riak.style.willChange = 'auto'; // Bebaskan layer GPU
      }

      // Fase 3 (0.4 -> 1): isi kartu memudar masuk
      const progressIsi = ScrollUtils.easeOutCubic(
        Math.max(0, Math.min(1, (progress - 0.4) / 0.6))
      );
      isi.style.opacity = progressIsi;
    }

    // Pivot adaptif per perangkat
    const pivot = ScrollUtils.dapatkanPivotAdaptif();
    ScrollUtils.bindScrollProgress(kartu, updateKartu, pivot);
    updateKartu(ScrollUtils.calculateViewportProgress(kartu, pivot));
  });
})();
