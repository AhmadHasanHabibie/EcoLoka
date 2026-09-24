/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KARTU STATISTIK (animasi-kartu-statistik.js)
 * Fitur: Card Deal + 3D Flip Reveal (Desktop) & Per-Card Fade/Slide (Mobile)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Arsitektur: 100% Client-Side Vanilla JavaScript (Zero External Library)
 * ==========================================================================
 * 
 * PERBAIKAN BUG MOBILE:
 * 1. Di mobile (< 768px), kalkulasi progress DIUBAH MENJADI PER-KARTU (independen),
 *    bukan per-grid. Ini mencegah kartu "19,4 Juta" dsb. macet di opacity 0.1/pudar
 *    karena grid 1 kolom yang sangat tinggi di mobile.
 * 2. Menggunakan ScrollUtils.getTinggiViewportAktual() & pivot adaptif (0.42).
 * 3. Mendengarkan event 'viewportBerubah' saat address bar Chrome Android collapse/expand.
 */

(function () {
  'use strict';

  function initStatCardsAnimation() {
    const section = document.getElementById('statsGrid');
    if (!section || typeof ScrollUtils === 'undefined') return;

    const wraps = Array.from(section.querySelectorAll('.stat-card-wrap'));
    const cards = Array.from(section.querySelectorAll('.stat-card-flip'));
    if (cards.length === 0) return;

    const STACK_ROTATIONS = [-6, -2, 3, 7];
    const STAGGER_PER_CARD = 0.12;
    const isMobile = () => window.innerWidth < 768;

    /**
     * Menghitung offset jarak kartu terhadap tumpukan (posisi kartu pertama)
     */
    function getStackOffset(index) {
      if (wraps.length === 0) return { x: 0, y: 0 };
      const firstRect = wraps[0].getBoundingClientRect();
      const currentRect = wraps[index].getBoundingClientRect();

      return {
        x: firstRect.left - currentRect.left,
        y: firstRect.top - currentRect.top,
      };
    }

    // DESKTOP / TABLET (>= 768px): Card Deal + 3D Flip Reveal berbasis grid
    function updateCardsDesktop(overallProgress) {
      cards.forEach((card, index) => {
        const startDelay = index * STAGGER_PER_CARD;
        let cardProgress = (overallProgress - startDelay) / (1 - startDelay || 1);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        const easedProgress = ScrollUtils.easeOutCubic(cardProgress);

        card.style.opacity = 1;
        const offset = getStackOffset(index);
        const rotateStack = STACK_ROTATIONS[index % STACK_ROTATIONS.length];

        const x = ScrollUtils.lerp(offset.x, 0, easedProgress);
        const y = ScrollUtils.lerp(offset.y, 0, easedProgress);
        const rotateZ = ScrollUtils.lerp(rotateStack, 0, easedProgress);
        const rotateY = ScrollUtils.lerp(180, 0, easedProgress);
        const scale = ScrollUtils.lerp(0.92, 1, easedProgress);

        card.style.transform = `translate(${x}px, ${y}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.zIndex = cardProgress < 1 ? cards.length - index : 1;
      });
    }

    // MOBILE (< 768px): Independen per kartu — SETIAP kartu memantau posisinya sendiri!
    // Dijamin 100% opacity = 1 saat kartu mencapai pivot adaptif
    wraps.forEach((wrap, index) => {
      const card = cards[index];
      if (!card) return;

      function updateSingleCard(progress) {
        if (!isMobile()) return; // Abaikan jika mode desktop sedang aktif
        const eased = ScrollUtils.easeOutCubic(progress);
        const translateY = ScrollUtils.lerp(20, 0, eased);
        card.style.transform = `translateY(${translateY}px)`;
        // Pastikan solid penuh (opacity 1) saat mendekati pivot
        card.style.opacity = progress >= 0.85 ? 1 : Math.max(0.2, eased);
        card.style.zIndex = 1;
      }

      ScrollUtils.bindScrollProgress(wrap, updateSingleCard, ScrollUtils.dapatkanPivotAdaptif());
    });

    // Desktop grid listener
    ScrollUtils.bindScrollProgress(section, (progress) => {
      if (!isMobile()) {
        updateCardsDesktop(progress);
      }
    }, 0.5);

    // Recalculate saat resize (debounced)
    window.addEventListener(
      'resize',
      ScrollUtils.debounce(() => {
        if (!isMobile()) {
          const progress = ScrollUtils.calculateViewportProgress(section, 0.5);
          updateCardsDesktop(progress);
        }
      }, 150),
      { passive: true }
    );

    // Dengarkan event resize visualViewport khusus Android Chrome
    document.addEventListener('viewportBerubah', () => {
      if (!isMobile()) {
        const progress = ScrollUtils.calculateViewportProgress(section, 0.5);
        updateCardsDesktop(progress);
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatCardsAnimation);
  } else {
    initStatCardsAnimation();
  }
})();
