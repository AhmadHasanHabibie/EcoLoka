/**
 * ==========================================================================
 * ECOLOKA — GELOMBANG FONT (VARIABLE FONT AXIS ANIMATION)
 * File: assets/js/gelombang-font.js
 * ==========================================================================
 * Heading dipecah per-huruf (murni visual, aksesibilitas dijaga via
 * aria-label + role="text"), lalu sebuah "gelombang ketebalan font"
 * menyapu dari kiri ke kanan mengikuti progress scroll (viewport-center,
 * tanpa pinning — pola yang sama dengan seluruh animasi lain di situs).
 * Teknik ini sangat jarang dipakai karena butuh variable font, namun
 * sangat ringan secara performa (hanya mengubah satu CSS property per huruf).
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

  const heading = document.getElementById('headingTentang');
  if (!heading) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function pecahTeksJadiHuruf(elemen) {
    const teksAsli = elemen.textContent.trim();
    elemen.setAttribute('aria-label', teksAsli);
    elemen.setAttribute('role', 'text');

    const bungkus = document.createDocumentFragment();
    teksAsli.split('').forEach((karakter) => {
      const span = document.createElement('span');
      span.className = 'huruf-gelombang';
      span.textContent = karakter === ' ' ? '\u00A0' : karakter;
      span.setAttribute('aria-hidden', 'true');
      bungkus.appendChild(span);
    });

    elemen.textContent = '';
    elemen.appendChild(bungkus);
  }

  pecahTeksJadiHuruf(heading);
  const hurufList = Array.from(heading.querySelectorAll('.huruf-gelombang'));

  // Kunci lebar tiap huruf setelah font benar-benar dimuat (cegah layout shift)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      hurufList.forEach((span) => {
        const lebar = span.getBoundingClientRect().width;
        if (lebar > 0) {
          span.style.width = `${lebar}px`;
          span.style.textAlign = 'center';
        }
      });
    });
  }

  const BOBOT_ISTIRAHAT = 700; // sama dengan ketebalan heading normal di situs
  const BOBOT_PUNCAK = 800;    // ketebalan maksimal saat gelombang melintas (batas atas axis Sora)
  const LEBAR_GELOMBANG = 6;   // berapa huruf yang terpengaruh gelombang sekaligus

  if (prefersReducedMotion) {
    hurufList.forEach((span) => {
      span.style.fontVariationSettings = `'wght' ${BOBOT_ISTIRAHAT}`;
    });
    return;
  }

  // Sebelum scroll, tampilkan heading dalam ketebalan istirahat penuh
  // (graceful default), gelombang baru "menyapu" saat mulai discroll
  hurufList.forEach((span) => {
    span.style.fontVariationSettings = `'wght' ${BOBOT_ISTIRAHAT}`;
  });

  function updateGelombang(progress) {
    const totalHuruf = hurufList.length;
    // Posisi gelombang bergerak dari SEBELUM huruf pertama sampai SETELAH
    // huruf terakhir, memastikan setiap huruf terlewati gelombang tepat
    // satu kali secara merata sepanjang progress 0 -> 1
    const posisiGelombang =
      progress * (totalHuruf + LEBAR_GELOMBANG) - LEBAR_GELOMBANG;

    hurufList.forEach((span, index) => {
      const jarak = Math.abs(index - posisiGelombang);
      let bobot;

      if (jarak < LEBAR_GELOMBANG / 2) {
        // Fungsi falloff halus (cosine window) — bobot memuncak persis di
        // pusat gelombang, melembut ke bobot istirahat di tepi gelombang
        const t = jarak / (LEBAR_GELOMBANG / 2);
        const kedekatan = (Math.cos(t * Math.PI) + 1) / 2; // 1 di pusat, 0 di tepi
        bobot = ScrollUtils.lerp(BOBOT_ISTIRAHAT, BOBOT_PUNCAK, kedekatan);
      } else {
        bobot = BOBOT_ISTIRAHAT;
      }

      span.style.fontVariationSettings = `'wght' ${Math.round(bobot)}`;
    });
  }

  ScrollUtils.bindScrollProgress(heading, updateGelombang, 0.5);
})();
