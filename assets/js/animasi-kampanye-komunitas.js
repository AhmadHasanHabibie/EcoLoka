/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KAMPANYE KOMUNITAS & HUTAN TUMBUH
 * File: assets/js/animasi-kampanye-komunitas.js
 * ==========================================================================
 * Setiap kartu kampanye di halaman Komunitas mendapat animasi entrance
 * (fade + slide) DAN animasi hutan tumbuh di bagian bawahnya, dengan
 * progress yang DIHITUNG SENDIRI oleh masing-masing kartu (per-card,
 * BUKAN per-grid) — menghindari bug "menggantung" yang pernah terjadi
 * sebelumnya di grid artikel Edukasi. Setiap kartu dijamin selesai
 * beranimasi TEPAT saat kartu itu sendiri berada di titik tengah viewport.
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
      pohonList.forEach((pohon) => (pohon.style.transform = 'scaleY(1)'));
      return;
    }

    // Set kondisi awal TERSEMBUNYI via JS (bukan default CSS), agar tanpa
    // JS kartu tetap tampil normal 100% (progressive enhancement)
    kartu.style.opacity = 0;
    kartu.style.transform = 'translateY(28px)';
    pohonList.forEach((pohon) => (pohon.style.transform = 'scaleY(0)'));

    function updateKartu(progress) {
      // --- FASE 1 (0 - 0.5): kartu fade + slide masuk ---
      const progressKartu = ScrollUtils.easeOutCubic(
        Math.min(progress / 0.5, 1)
      );
      kartu.style.opacity = progressKartu;
      kartu.style.transform = `translateY(${ScrollUtils.lerp(28, 0, progressKartu)}px)`;

      // --- FASE 2 (0.3 - 1.0, sedikit tumpang tindih dengan Fase 1 agar mulus):
      //     pohon tumbuh satu per satu (stagger), dijamin SEMUA pohon
      //     mencapai tinggi penuh TEPAT saat progress keseluruhan = 1 ---
      const progressHutanMentah = (progress - 0.3) / 0.7;
      const progressHutan = Math.max(0, Math.min(1, progressHutanMentah));

      pohonList.forEach((pohon, index) => {
        const staggerDelay = index * 0.1;
        let p = (progressHutan - staggerDelay) / (1 - staggerDelay || 1);
        p = ScrollUtils.easeOutCubic(Math.max(0, Math.min(1, p)));
        pohon.style.transform = `scaleY(${p})`;
      });
    }

    // KUNCI ANTI-BUG: bind progress ke KARTU ITU SENDIRI, bukan ke grid/section
    // pembungkusnya — setiap kartu 100% independen dari kartu lain.
    ScrollUtils.bindScrollProgress(kartu, updateKartu, 0.5);
  });
})();
