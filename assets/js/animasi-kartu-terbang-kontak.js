/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KARTU KONTAK TERBANG KONVERGEN
 * File: assets/js/animasi-kartu-terbang-kontak.js
 * ==========================================================================
 * Setiap kartu info kontak "terbang masuk" dari sudut berbeda (kiri-atas,
 * kanan-atas, kiri-bawah, kanan-bawah) dan mendarat rapi sejajar.
 * Progress DIHITUNG SENDIRI oleh masing-masing kartu (per-card).
 *
 * Optimasi Responsivitas & Performa:
 * - Pivot adaptif (0.42 di mobile, 0.46 di tablet, 0.5 di desktop)
 * - Vektor terbang diskalakan adaptif pada mobile (<480px) agar pas di layar
 * - will-change dinamis (transform, opacity) yang dilepas begitu mendarat
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

  const kartuList = Array.from(document.querySelectorAll('.kontak-card'));
  if (kartuList.length === 0) return;

  const VEKTOR_ARAH = {
    'kiri-atas':   { x: -130, y: -90, rotasi: -14 },
    'kanan-atas':  { x: 130,  y: -90, rotasi: 14 },
    'kiri-bawah':  { x: -130, y: 90,  rotasi: 12 },
    'kanan-bawah': { x: 130,  y: 90,  rotasi: -12 },
  };

  kartuList.forEach((kartu) => {
    const arah = kartu.dataset.arah;
    const vektorAsli = VEKTOR_ARAH[arah] || { x: 0, y: 80, rotasi: 0 };

    if (prefersReducedMotion) {
      kartu.style.transform = 'translate(0, 0) rotate(0deg)';
      kartu.style.opacity = 1;
      kartu.style.willChange = 'auto';
      return;
    }

    // Hitung offset awal dengan faktor skala layar HP (<480px)
    const faktorSkala = window.innerWidth < 480 ? 0.55 : 1;
    const vektor = {
      x: vektorAsli.x * faktorSkala,
      y: vektorAsli.y * faktorSkala,
      rotasi: vektorAsli.rotasi
    };

    kartu.style.transform = `translate(${vektor.x}px, ${vektor.y}px) rotate(${vektor.rotasi}deg)`;
    kartu.style.opacity = 0;

    function updateKartu(progress) {
      if (progress > 0 && progress < 1) {
        kartu.style.willChange = 'transform, opacity';
      } else {
        kartu.style.willChange = 'auto'; // Bebaskan layer GPU setelah mendarat
      }

      const progressPosisi = ScrollUtils.easeOutCubic(progress);
      const progressRotasi = ScrollUtils.easeOutBackSubtle
        ? ScrollUtils.easeOutBackSubtle(progress)
        : ScrollUtils.easeOutCubic(progress);

      const x = ScrollUtils.lerp(vektor.x, 0, progressPosisi);
      const y = ScrollUtils.lerp(vektor.y, 0, progressPosisi);
      const rotasi = ScrollUtils.lerp(vektor.rotasi, 0, progressRotasi);

      kartu.style.transform = `translate(${x}px, ${y}px) rotate(${rotasi}deg)`;
      kartu.style.opacity = ScrollUtils.easeOutCubic(Math.min(progress / 0.7, 1));
    }

    // Pivot adaptif per perangkat
    ScrollUtils.bindScrollProgress(kartu, updateKartu, ScrollUtils.dapatkanPivotAdaptif());
  });
})();
