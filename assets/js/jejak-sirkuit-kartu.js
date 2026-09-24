/**
 * ==========================================================================
 * ECOLOKA — JEJAK SIRKUIT CAHAYA (SVG CIRCUIT TRACE & NODE)
 * File: assets/js/jejak-sirkuit-kartu.js
 * ==========================================================================
 * Border kartu "digambar" seperti jejak sirkuit (SVG rect + stroke-dashoffset),
 * lalu satu titik cahaya melintas sekali mengelilingi border yang sudah
 * selesai, sebagai penanda "sirkuit teraktivasi". Progress DIHITUNG SENDIRI
 * oleh masing-masing kartu (per-card, bukan per-grid) — konsisten dengan
 * perbaikan bug yang sudah diterapkan di halaman lain.
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
        const titikPanjang = progressNode * panjangKeliling;
        const titik = rect.getPointAtLength(titikPanjang);
        node.style.transform = `translate(${titik.x - 4}px, ${titik.y - 4}px)`;
        node.style.opacity = Math.sin(progressNode * Math.PI);
      } else {
        node.style.opacity = 0;
      }

      if (isi) {
        const progressIsi = ScrollUtils.easeOutCubic(
          Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
        );
        isi.style.opacity = progressIsi;
      }
    }

    window.addEventListener('resize', () => {
      syncDimensions();
      panjangKeliling = rect.getTotalLength ? rect.getTotalLength() : 0;
      rect.style.strokeDasharray = panjangKeliling;
    }, { passive: true });

    ScrollUtils.bindScrollProgress(kartu, updateKartu, 0.5);
  });
})();
