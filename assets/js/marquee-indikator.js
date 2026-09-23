/**
 * marquee-indikator.js
 * Mengubah grid 4 kartu indikator menjadi track horizontal infinite yang
 * bergerak SESUAI ARAH SCROLL pengguna (bukan autoplay) + INTERAKSI DRAG MANUAL
 * (mouse & touch). Scroll ke bawah -> kartu bergeser kanan; scroll ke atas ->
 * kartu bergeser kiri; saat scroll berhenti, pengguna dapat menggeser (swipe/drag)
 * kartu secara manual. Begitu scroll dilanjutkan, kontrol kembali otomatis
 * mengikuti arah scroll dari posisi terakhir tanpa lompatan visual.
 * 
 * Kepatuhan: 100% Native Vanilla JS (Pointer Events + IntersectionObserver + requestAnimationFrame)
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

    /**
     * Menerapkan wrap infinite + transform — logika ini diekstrak ke fungsi
     * terpisah agar dipakai bersama oleh mode scroll dan mode drag manual.
     */
    function terapkanWrapDanTransform() {
      if (posisi > 0) {
        posisi -= lebarSatuSet;
      } else if (posisi < -2 * lebarSatuSet) {
        posisi += lebarSatuSet;
      }
      track.style.transform = `translateX(${posisi}px)`;
    }

    function updateMarquee(deltaY) {
      if (sedangDiDrag) return; // sedang digeser manual, abaikan input dari scroll sementara
      posisi += deltaY * FAKTOR_KECEPATAN;
      terapkanWrapDanTransform();
    }

    // ==========================================================================
    // TAMBAHAN: Interaksi drag manual (mouse & touch), menyatu dengan variabel
    // `posisi` yang sama dipakai oleh mode scroll-driven di atas.
    // ==========================================================================
    let sedangDiDrag = false;
    let posisiMouseAwal = 0;
    let posisiSaatMulaiDrag = 0;

    function mulaiDrag(e) {
      sedangDiDrag = true;
      posisiMouseAwal = e.clientX;
      posisiSaatMulaiDrag = posisi;
      viewport.classList.add('is-dragging');
      // Pointer capture memastikan gerakan tetap terdeteksi meski kursor
      // sempat keluar dari area viewport saat menggeser cepat
      if (typeof viewport.setPointerCapture === 'function') {
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    }

    function selamaDrag(e) {
      if (!sedangDiDrag) return;
      const jarakGeser = e.clientX - posisiMouseAwal;
      posisi = posisiSaatMulaiDrag + jarakGeser;
      terapkanWrapDanTransform();
    }

    function akhiriDrag(e) {
      if (!sedangDiDrag) return;
      sedangDiDrag = false;
      viewport.classList.remove('is-dragging');
      if (typeof viewport.releasePointerCapture === 'function' && e && e.pointerId) {
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    }

    viewport.addEventListener('pointerdown', mulaiDrag);
    viewport.addEventListener('pointermove', selamaDrag);
    viewport.addEventListener('pointerup', akhiriDrag);
    viewport.addEventListener('pointercancel', akhiriDrag);

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
        terapkanWrapDanTransform();
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquee);
  } else {
    initMarquee();
  }
})();
