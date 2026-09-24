/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KARTU KONTAK TERBANG KONVERGEN
 * File: assets/js/animasi-kartu-terbang-kontak.js
 * ==========================================================================
 * Setiap kartu kontak "terbang masuk" dari sudut yang berbeda-beda,
 * lalu mendarat sejajar rapi di posisi grid normalnya. Progress DIHITUNG
 * SENDIRI oleh masing-masing kartu (per-card, BUKAN per-grid) — konsisten
 * dengan perbaikan bug yang sudah diterapkan di halaman Edukasi & Komunitas
 * sebelumnya. Setiap kartu dijamin "mendarat" TEPAT saat kartu itu sendiri
 * berada di titik tengah viewport.
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

  // Titik awal "terbang" per arah — offset dalam piksel dari posisi akhir,
  // plus sedikit rotasi awal untuk kesan kertas yang melayang, bukan kaku
  const VEKTOR_ARAH = {
    'kiri-atas':   { x: -130, y: -90, rotasi: -14 },
    'kanan-atas':  { x: 130,  y: -90, rotasi: 14 },
    'kiri-bawah':  { x: -130, y: 90,  rotasi: 12 },
    'kanan-bawah': { x: 130,  y: 90,  rotasi: -12 },
  };

  kartuList.forEach((kartu) => {
    const arah = kartu.dataset.arah;
    const vektor = VEKTOR_ARAH[arah] || { x: 0, y: 80, rotasi: 0 }; // fallback aman jika data-arah tidak dikenali

    if (prefersReducedMotion) {
      kartu.style.transform = 'translate(0, 0) rotate(0deg)';
      kartu.style.opacity = 1;
      return;
    }

    // Kondisi awal (sebelum terlihat): offset sesuai arah, sedikit transparan
    kartu.style.transform = `translate(${vektor.x}px, ${vektor.y}px) rotate(${vektor.rotasi}deg)`;
    kartu.style.opacity = 0;

    function updateKartu(progress) {
      const progressPosisi = ScrollUtils.easeOutCubic(progress);
      const progressRotasi = ScrollUtils.easeOutBackSubtle
        ? ScrollUtils.easeOutBackSubtle(progress)
        : ScrollUtils.easeOutCubic(progress);

      const x = ScrollUtils.lerp(vektor.x, 0, progressPosisi);
      const y = ScrollUtils.lerp(vektor.y, 0, progressPosisi);
      // Rotasi memakai easing "overshoot subtle" agar terasa seperti
      // benar-benar "mendarat dan mengendap", bukan berhenti kaku tiba-tiba
      const rotasi = ScrollUtils.lerp(vektor.rotasi, 0, progressRotasi);

      kartu.style.transform = `translate(${x}px, ${y}px) rotate(${rotasi}deg)`;
      kartu.style.opacity = ScrollUtils.easeOutCubic(Math.min(progress / 0.7, 1));
    }

    // KUNCI ANTI-BUG: bind progress ke KARTU ITU SENDIRI, bukan ke grid
    // pembungkusnya — setiap kartu 100% independen, sesuai permintaan
    // "viewpoint udah di tengah otomatis sejajar lagi dia" per kartu.
    ScrollUtils.bindScrollProgress(kartu, updateKartu, 0.5);
  });
})();
