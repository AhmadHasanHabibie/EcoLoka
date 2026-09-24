/**
 * ==========================================================================
 * ECOLOKA — ANIMASI BUKU TERBUKA & KATA TERBANG (animasi-buku-filosofi.js)
 * (REVISI 2: Kata Terbang Mendarat di Ruang Kosong Bawah Kartu Manifesto)
 * 
 * Section: "Filosofi & Visi" (Beranda EcoLoka)
 * 
 * Perubahan Utama:
 * 1. Teks tegak normal (tanpa italic) & orientasi horizontal normal.
 * 2. Kata terbang berformat pill chip dan meluncur dari tengah kartu kutipan
 *    menuju ruang kosong alami tepat di bawah kartu Manifesto EcoLoka.
 * 3. Posisi dihitung dinamis dari layout asli (offsetTop/offsetHeight — stabil
 *    terhadap transform 3D), bukan angka tebakan manual.
 * 4. Dilengkapi pengaman otomatis (isLandingZoneSufficient) agar tidak tampil
 *    jika ruang kosong tidak memadai.
 * 5. Tetap dinonaktifkan di layout satu-kolom (mobile <= 768px).
 * ==========================================================================
 */

(function () {
  'use strict';

  const isSupported =
    'IntersectionObserver' in window &&
    'requestAnimationFrame' in window &&
    typeof ScrollUtils !== 'undefined';
  if (!isSupported) return;

  const section = document.getElementById('filosofiBuku');
  if (!section) return;

  const pageKiri = document.getElementById('bukuHalamanKiri');
  const pageKanan = document.getElementById('bukuHalamanKanan');
  if (!pageKiri || !pageKanan) return;

  const spine = section.querySelector('.filosofi-book__spine');
  const flyingLayer = document.getElementById('flyingLayer');

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isSingleColumnLayout = () => window.innerWidth <= 768;

  const KATA_TERBANG = ['Konsisten', 'Bumi', 'Bersama', 'Aksi'];
  const LINE_HEIGHT = 40; // jarak antar baris kata saat "mendarat", cukup lega agar tidak berhimpitan

  let flyingElements = [];

  /**
   * Menghitung batas area kosong di bawah kartu kanan, berdasarkan
   * layout ASLI (bukan hasil transform), agar akurat meski buku sedang beranimasi.
   */
  function getLandingZone() {
    const card = pageKanan.querySelector(':scope > div') || pageKanan;
    const cardHeight = card.offsetHeight || pageKanan.offsetHeight;
    const zoneTop = pageKanan.offsetTop + cardHeight + 24; // 24px jarak napas dari bawah kartu
    const zoneLeft = pageKanan.offsetLeft;
    const zoneWidth = pageKanan.offsetWidth;
    const totalRowHeight = Math.max(
      pageKiri.offsetHeight,
      pageKanan.offsetHeight
    );
    const zoneBottomLimit = pageKiri.offsetTop + totalRowHeight;

    return { top: zoneTop, left: zoneLeft, width: zoneWidth, bottomLimit: zoneBottomLimit };
  }

  /**
   * Titik asal kata terbang: dari tengah kartu kutipan (seolah kata
   * "dipetik" dari dalam kutipan), sebelum meluncur ke zona pendaratan.
   */
  function getOriginPoint() {
    const card = pageKanan.querySelector(':scope > div') || pageKanan;
    const cardHeight = card.offsetHeight || pageKanan.offsetHeight;
    return {
      x: pageKanan.offsetLeft + pageKanan.offsetWidth / 2,
      y: pageKanan.offsetTop + cardHeight * 0.4,
    };
  }

  function buildFlyingWords() {
    if (!flyingLayer) return;
    flyingLayer.innerHTML = '';
    flyingElements = KATA_TERBANG.map((teks) => {
      const span = document.createElement('span');
      span.className = 'flying-word';
      span.textContent = teks;
      span.setAttribute('aria-hidden', 'true');
      flyingLayer.appendChild(span);
      return { el: span, teks };
    });
  }

  function isLandingZoneSufficient(zone) {
    const neededHeight = (flyingElements.length - 1) * LINE_HEIGHT + 32;
    return (zone.bottomLimit - zone.top) >= (neededHeight - 30);
  }

  if (!isSingleColumnLayout()) {
    buildFlyingWords();
  }

  if (prefersReducedMotion) {
    pageKiri.style.transform = 'rotateY(0deg)';
    pageKanan.style.transform = 'rotateY(0deg)';
    if (spine) spine.style.opacity = '0';
    return;
  }

  function updateBook(progress) {
    const eased = ScrollUtils.easeOutCubic(progress);

    if (isSingleColumnLayout()) {
      pageKiri.style.transform = `rotateY(${ScrollUtils.lerp(40, 0, eased).toFixed(2)}deg)`;
      pageKanan.style.transform = `rotateY(${ScrollUtils.lerp(-40, 0, eased).toFixed(2)}deg)`;
      if (spine) {
        spine.style.opacity = ScrollUtils.lerp(1, 0, Math.min(progress / 0.4, 1)).toFixed(2);
      }
      return;
    }

    const rotateKiri = ScrollUtils.lerp(65, 0, eased);
    const rotateKanan = ScrollUtils.lerp(-65, 0, eased);
    pageKiri.style.transform = `rotateY(${rotateKiri.toFixed(2)}deg)`;
    pageKanan.style.transform = `rotateY(${rotateKanan.toFixed(2)}deg)`;
    if (spine) {
      spine.style.opacity = ScrollUtils.lerp(1, 0, Math.min(progress / 0.4, 1)).toFixed(2);
    }

    if (flyingElements.length === 0) return;

    const zone = getLandingZone();

    // Pengaman: jika ruang kosong ternyata tidak cukup (misal konten diedit
    // di kemudian hari), sembunyikan lapisan kata terbang daripada memaksakan
    // tampil dan berisiko tumpang tindih.
    if (!isLandingZoneSufficient(zone)) {
      flyingElements.forEach((item) => (item.el.style.opacity = '0'));
      return;
    }

    const origin = getOriginPoint();
    const flyProgressRaw = (progress - 0.35) / 0.65;
    const flyProgress = ScrollUtils.easeOutCubic(
      Math.max(0, Math.min(1, flyProgressRaw))
    );

    flyingElements.forEach((item, index) => {
      const staggerDelay = index * 0.1;
      let p = (flyProgress - staggerDelay) / (1 - staggerDelay || 1);
      p = Math.max(0, Math.min(1, p));

      // Titik mendarat: berjajar rapi ke bawah, rata kiri dengan kartu kanan
      const landingX = zone.left;
      const landingY = zone.top + index * LINE_HEIGHT;

      const x = ScrollUtils.lerp(origin.x, landingX, p);
      const y = ScrollUtils.lerp(origin.y, landingY, p);
      const scale = ScrollUtils.lerp(0.8, 1, p);
      const rotate = ScrollUtils.lerp(0, index % 2 === 0 ? -2 : 2, p); // sedikit variasi organik, sangat halus

      item.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotate.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
      item.el.style.opacity = p.toFixed(2);
    });
  }

  ScrollUtils.bindScrollProgress(section, updateBook, 0.5);
  updateBook(ScrollUtils.calculateViewportProgress(section, 0.5));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isSingleColumnLayout()) {
        if (flyingLayer) flyingLayer.innerHTML = '';
        flyingElements = [];
      } else if (flyingElements.length === 0) {
        buildFlyingWords();
      }
    }, 200);
  });
})();
