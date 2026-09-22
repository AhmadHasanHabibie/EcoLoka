/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KARTU STATISTIK ("MEMBAGIKAN KARTU REMI")
 * Fitur: Card Deal + 3D Flip Reveal, Natural Scroll Flow
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Arsitektur: 100% Client-Side Vanilla JavaScript (Zero External Library)
 * ==========================================================================
 * 
 * MEKANISME TEKNIS:
 * 1. State Awal: Keempat kartu berada dalam satu "tumpukan kartu remi"
 *    menghadap belakang (rotateY 180deg) di posisi kartu pertama dengan
 *    sedikit rotasi acak organik (-6deg, -2deg, 3deg, 7deg).
 * 2. Card Deal + Flip: Begitu section memasuki viewport, kartu meluncur
 *    satu per satu (staggered 0.12) ke posisi grid aslinya sambil membalik
 *    ke sisi depan (rotateY 0deg) dan meluruskan rotasi Z.
 * 3. 100% Natural Scroll: Mengalir normal tanpa penahanan/pinning.
 * 4. Fallback Mobile: Transisi disederhanakan menjadi fade + slide-up demi
 *    kelancaran 60fps di perangkat layar kecil.
 */

(function () {
  'use strict';

  function initStatCardsAnimation() {
    const section = document.getElementById('statsGrid');
    if (!section || typeof ScrollUtils === 'undefined') return;

    const wraps = Array.from(section.querySelectorAll('.stat-card-wrap'));
    const cards = Array.from(section.querySelectorAll('.stat-card-flip'));
    if (cards.length === 0) return;

    // Rotasi acak-organik per kartu untuk kesan tumpukan kartu remi manusiawi
    const STACK_ROTATIONS = [-6, -2, 3, 7];
    const STAGGER_PER_CARD = 0.12;
    const isMobile = () => window.innerWidth < 768;

    /**
     * Menghitung offset jarak kartu terhadap tumpukan (posisi kartu pertama)
     * Menggunakan .stat-card-wrap agar stabil bebas dari transform feedback loop.
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

    function updateCards(overallProgress) {
      const mobile = isMobile();

      cards.forEach((card, index) => {
        const startDelay = index * STAGGER_PER_CARD;
        // Progress khusus per kartu, dijamin mencapai 1 saat overallProgress = 1
        let cardProgress = (overallProgress - startDelay) / (1 - startDelay || 1);
        cardProgress = Math.max(0, Math.min(1, cardProgress));
        const easedProgress = ScrollUtils.easeOutCubic(cardProgress);

        if (mobile) {
          // Fallback Mobile: Fade + slide-up performan
          const translateY = ScrollUtils.lerp(24, 0, easedProgress);
          card.style.transform = `translateY(${translateY}px)`;
          card.style.opacity = easedProgress;
          card.style.zIndex = 1;
          return;
        }

        // Desktop / Tablet: Card Deal + 3D Flip Reveal
        card.style.opacity = 1;
        const offset = getStackOffset(index);
        const rotateStack = STACK_ROTATIONS[index % STACK_ROTATIONS.length];

        const x = ScrollUtils.lerp(offset.x, 0, easedProgress);
        const y = ScrollUtils.lerp(offset.y, 0, easedProgress);
        const rotateZ = ScrollUtils.lerp(rotateStack, 0, easedProgress);
        const rotateY = ScrollUtils.lerp(180, 0, easedProgress); // 180 (belakang) -> 0 (depan)
        const scale = ScrollUtils.lerp(0.92, 1, easedProgress);

        card.style.transform = `translate(${x}px, ${y}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`;

        // z-index dinamis: kartu di atas tumpukan tampil di depan selama proses deal
        card.style.zIndex = cardProgress < 1 ? cards.length - index : 1;
      });
    }

    // Registrasi listener scroll via shared utility (target tengah layar = 0.5)
    ScrollUtils.bindScrollProgress(section, updateCards, 0.5);

    // Recalculate saat resize (debounced) agar posisi offset tumpukan selalu presisi
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const progress = ScrollUtils.calculateViewportProgress(section, 0.5);
        updateCards(progress);
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatCardsAnimation);
  } else {
    initStatCardsAnimation();
  }
})();
