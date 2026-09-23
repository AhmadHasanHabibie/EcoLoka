/**
 * marquee-indikator.js
 * Mengubah grid 4 kartu indikator menjadi track horizontal infinite yang
 * bergerak SESUAI ARAH SCROLL pengguna (bukan autoplay). Scroll ke bawah
 * -> kartu bergeser kanan; scroll ke atas -> kartu bergeser kiri; berhenti
 * scroll -> kartu berhenti seketika. Infinite dicapai dengan menduplikasi
 * satu baris kartu menjadi 3 salinan identik dan me-wrap posisi secara mulus.
 * 
 * Kepatuhan: 100% Native Vanilla JS (IntersectionObserver + requestAnimationFrame)
 * Zero External Dependencies, Accessible (aria-hidden pada klon), Reduced-Motion Compliant
 */

(function () {
  const isSupported =
    'IntersectionObserver' in window && 'requestAnimationFrame' in window;
  if (!isSupported) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReducedMotion) return; // biarkan grid statis normal, tanpa marquee

  function initMarquee() {
    const gridAsli = document.getElementById('indikatorGrid');
    if (!gridAsli) return;

    const kartuAsli = Array.from(gridAsli.children);
    if (kartuAsli.length === 0) return;

    // --- Bangun struktur marquee: viewport + track berisi 3 salinan kartu ---
    const viewport = document.createElement('div');
    viewport.className = 'indikator-marquee-viewport';

    const track = document.createElement('div');
    track.className = 'indikator-marquee-track';

    // Salinan 1, 2, 3 — identik persis, demi efek infinite yang mulus
    for (let salinan = 0; salinan < 3; salinan++) {
      kartuAsli.forEach((kartu) => {
        const klon = kartu.cloneNode(true);
        klon.classList.add('indikator-card'); // pastikan class tetap konsisten untuk styling
        if (salinan > 0) {
          // Salinan duplikat murni dekoratif untuk kontinuitas visual —
          // tandai agar pembaca layar tidak membacanya berulang kali
          klon.setAttribute('aria-hidden', 'true');
          klon.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((el) => {
            el.setAttribute('tabindex', '-1');
          });
        }
        track.appendChild(klon);
      });
    }

    viewport.appendChild(track);
    gridAsli.replaceWith(viewport); // ganti grid asli dengan struktur marquee baru

    // --- Hitung lebar SATU set kartu (setelah elemen benar-benar ter-render) ---
    let lebarSatuSet = 0;
    function hitungLebarSatuSet() {
      const jumlahKartuAsli = kartuAsli.length;
      if (track.children.length >= jumlahKartuAsli * 2) {
        const offsetDiff = track.children[jumlahKartuAsli].offsetLeft - track.children[0].offsetLeft;
        if (offsetDiff > 0) {
          lebarSatuSet = offsetDiff;
          return;
        }
      }
      const anak = Array.from(track.children).slice(0, jumlahKartuAsli);
      const computedGap = parseFloat(getComputedStyle(track).gap) || 24;
      lebarSatuSet = anak.reduce((total, el) => total + el.offsetWidth, 0) + computedGap * jumlahKartuAsli;
    }
    hitungLebarSatuSet();

    // --- Posisi awal: mulai dari SET TENGAH (salinan ke-2), agar ada ruang
    //     buffer untuk bergerak ke kiri maupun kanan tanpa batas ---
    let posisi = -lebarSatuSet;
    track.style.transform = `translateX(${posisi}px)`;

    const FAKTOR_KECEPATAN = 0.35; // < 1 supaya gerak lebih lambat dari scroll asli, tetap terbaca

    function updateMarquee(deltaY) {
      posisi += deltaY * FAKTOR_KECEPATAN;

      // Wrap tak terbatas: jika sudah bergeser terlalu jauh ke kanan atau
      // kiri, "lompat" mundur/maju tepat satu lebar set — karena kontennya
      // identik, lompatan ini TIDAK TERLIHAT sama sekali oleh mata (mulus)
      if (posisi > 0) {
        posisi -= lebarSatuSet;
      } else if (posisi < -2 * lebarSatuSet) {
        posisi += lebarSatuSet;
      }

      track.style.transform = `translateX(${posisi}px)`;
    }

    if (window.ScrollUtils && typeof window.ScrollUtils.bindScrollDelta === 'function') {
      ScrollUtils.bindScrollDelta(viewport, updateMarquee);
    } else {
      // Fallback scroll listener
      let lastScrollY = window.scrollY;
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;
            updateMarquee(deltaY);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    // Hitung ulang lebar set & posisi saat resize, agar tetap akurat di breakpoint manapun
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        hitungLebarSatuSet();
        posisi = -lebarSatuSet;
        track.style.transform = `translateX(${posisi}px)`;
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquee);
  } else {
    initMarquee();
  }
})();
