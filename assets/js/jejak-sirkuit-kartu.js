/**
 * ==========================================================================
 * ECOLOKA — JEJAK SIRKUIT CAHAYA (SVG CIRCUIT TRACE & NODE)
 * File: assets/js/jejak-sirkuit-kartu.js
 * ==========================================================================
 * Border kartu "digambar" seperti jejak sirkuit (SVG rect + stroke-dashoffset),
 * lalu satu titik cahaya melintas sekali mengelilingi border yang sudah
 * selesai, sebagai penanda "sirkuit teraktivasi". Progress DIHITUNG SENDIRI
 * oleh masing-masing kartu (per-card, bukan per-grid).
 *
 * Optimasi Responsivitas & Performa:
 * - Pivot adaptif (0.42 di mobile, 0.46 di tablet, 0.5 di desktop)
 * - Dukungan interaksi sentuh (touchstart / touchend) untuk kartu di HP/tablet
 * - Debounced recalculation saat window resize
 * - will-change dinamis pada titik cahaya (node)
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

  const kartuList = Array.from(document.querySelectorAll('.prinsip-card'));
  if (kartuList.length === 0) return;

  // Dukungan interaksi sentuh untuk kartu di layar touchscreen
  const perangkatSentuh = ScrollUtils.isPerangkatSentuh();
  if (perangkatSentuh) {
    kartuList.forEach((kartu) => {
      kartu.addEventListener('touchstart', () => {
        kartu.classList.add('prinsip-card--aktif-sentuh');
      }, { passive: true });
      kartu.addEventListener('touchend', () => {
        setTimeout(() => kartu.classList.remove('prinsip-card--aktif-sentuh'), 400);
      }, { passive: true });
    });
  }

  kartuList.forEach((kartu) => {
    const rect = kartu.querySelector('.prinsip-card__jejak rect');
    const node = kartu.querySelector('.prinsip-card__node');
    const isi = kartu.querySelector('.prinsip-card__isi');
    if (!rect || !node) return;

    function syncDimensions() {
      const w = kartu.clientWidth - 3;
      const h = kartu.clientHeight - 3;
      if (w > 0 && h > 0) {
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
      }
    }
    syncDimensions();

    let panjangKeliling = rect.getTotalLength ? rect.getTotalLength() : 0;
    if (panjangKeliling > 0) {
      rect.style.strokeDasharray = panjangKeliling;
    }

    if (prefersReducedMotion) {
      rect.style.strokeDashoffset = 0;
      node.style.opacity = 0;
      node.style.willChange = 'auto';
      if (isi) isi.style.opacity = 1;
      return;
    }

    rect.style.strokeDashoffset = panjangKeliling;
    if (isi) isi.style.opacity = 0;

    function updateKartu(progress) {
      if (panjangKeliling === 0) {
        syncDimensions();
        panjangKeliling = rect.getTotalLength ? rect.getTotalLength() : 0;
        rect.style.strokeDasharray = panjangKeliling;
      }

      const progressBorder = ScrollUtils.easeOutCubic(
        Math.min(progress / 0.6, 1)
      );
      rect.style.strokeDashoffset = panjangKeliling * (1 - progressBorder);

      const progressNodeRaw = (progress - 0.6) / 0.3;
      const progressNode = Math.max(0, Math.min(1, progressNodeRaw));

      if (progressNode > 0 && progressNode < 1 && rect.getPointAtLength) {
        node.style.willChange = 'transform, opacity';
        const titikPanjang = progressNode * panjangKeliling;
        const titik = rect.getPointAtLength(titikPanjang);
        node.style.transform = `translate(${titik.x - 4}px, ${titik.y - 4}px)`;
        node.style.opacity = Math.sin(progressNode * Math.PI);
      } else {
        node.style.opacity = 0;
        node.style.willChange = 'auto'; // Lepas layer compositing saat diam
      }

      if (isi) {
        const progressIsi = ScrollUtils.easeOutCubic(
          Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
        );
        isi.style.opacity = progressIsi;
      }
    }

    // Debounced resize handler agar tidak layout thrashing
    window.addEventListener(
      'resize',
      ScrollUtils.debounce(() => {
        syncDimensions();
        panjangKeliling = rect.getTotalLength ? rect.getTotalLength() : 0;
        rect.style.strokeDasharray = panjangKeliling;
      }, 200),
      { passive: true }
    );

    // Pivot adaptif per perangkat
    const pivot = ScrollUtils.dapatkanPivotAdaptif();
    ScrollUtils.bindScrollProgress(kartu, updateKartu, pivot);
    updateKartu(ScrollUtils.calculateViewportProgress(kartu, pivot));
  });
})();
