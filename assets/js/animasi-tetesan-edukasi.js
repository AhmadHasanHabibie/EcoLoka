/**
 * ==========================================================================
 * ECOLOKA — ANIMASI TETESAN AIR MEMBENTUK CARD (animasi-tetesan-edukasi.js)
 * Versi: REVISI — Progress Independen Per-Kartu (Bukan Per-Grid)
 * Memperbaiki: Bug kartu "menggantung" belum selesai terbentuk meski sudah terbaca
 * Halaman: Pusat Edukasi Hijau (edukasi.html)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * ==========================================================================
 * 
 * MEKANISME:
 * Setiap kartu artikel Edukasi "lahir" dari satu tetes air, dengan progress
 * yang DIHITUNG SENDIRI oleh masing-masing kartu berdasarkan posisinya
 * sendiri terhadap viewport (bukan progress tunggal untuk seluruh grid).
 * Ini memastikan kartu manapun selesai terbentuk TEPAT saat kartu itu
 * sendiri berada di titik tengah layar, terlepas dari tinggi total grid.
 */

(function () {
  'use strict';

  const isSupported =
    'IntersectionObserver' in window && 'requestAnimationFrame' in window;
  if (!isSupported) return;

  const grid =
    document.getElementById('artikelGrid') ||
    document.getElementById('articles-grid');
  if (!grid) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function getEndRadius() {
    const rootRadius = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--radius-lg')
    );
    return rootRadius || 16; // samakan dengan --radius-lg di design system
  }

  function updateCardShape(card, cardProgress) {
    if (!card.dataset.startRadius) {
      const width = card.offsetWidth || 340;
      const height = card.offsetHeight || 360;
      card.dataset.startRadius = Math.max(width, height) / 2;
    }

    const startRadius = parseFloat(card.dataset.startRadius);
    const endRadius = getEndRadius();
    const isi = card.querySelector('.artikel-card__isi');

    // State Akhir (Progress Selesai 100%):
    // Kembalikan ke CSS default agar interaksi :hover (elevasi -4px & shadow) aktif normal
    if (cardProgress >= 1) {
      card.style.transform = '';
      card.style.borderRadius = '';
      card.style.opacity = '';
      card.classList.remove('is-droplet');
      card.classList.add('is-formed');
      if (isi) isi.style.opacity = '1';
      return;
    }

    card.classList.remove('is-formed');

    // --- TAHAP 1 (0.00 - 0.35): Jatuh sebagai tetesan, mulai membentuk bulat ---
    // --- TAHAP 2 (0.35 - 0.65): Bulat sempurna, sedikit membesar (menyerap) ---
    // --- TAHAP 3 (0.65 - 1.00): Mengalir membentuk card, isi memudar masuk ---

    let translateY, scale, borderRadius, isiOpacity;

    if (cardProgress <= 0.35) {
      const local = ScrollUtils.easeOutCubic(cardProgress / 0.35);
      translateY = ScrollUtils.lerp(-48, 0, local);
      scale = ScrollUtils.lerp(0.28, 0.55, local);
      borderRadius = startRadius; // tetap bulat penuh selama fase ini
      isiOpacity = 0;
      card.classList.add('is-droplet');
    } else if (cardProgress <= 0.65) {
      const local = ScrollUtils.easeOutCubic((cardProgress - 0.35) / 0.3);
      translateY = 0;
      scale = ScrollUtils.lerp(0.55, 0.85, local);
      borderRadius = startRadius; // masih bulat, sedang mengembang
      isiOpacity = 0;
      card.classList.add('is-droplet');
    } else {
      const local = ScrollUtils.easeOutCubic((cardProgress - 0.65) / 0.35);
      translateY = 0;
      scale = ScrollUtils.lerp(0.85, 1, local);
      borderRadius = ScrollUtils.lerp(startRadius, endRadius, local);
      isiOpacity = local; // isi kartu memudar masuk di tahap akhir
      card.classList.remove('is-droplet');
    }

    // Transisi kemunculan awal tetesan air agar lembut
    const cardFadeIn = Math.min(1, cardProgress / 0.08);

    card.style.opacity = cardFadeIn;
    card.style.transform = `translateY(${translateY}px) scale(${scale})`;
    card.style.borderRadius = `${borderRadius}px`;
    if (isi) isi.style.opacity = isiOpacity;
  }

  function initCards() {
    if (typeof ScrollUtils === 'undefined') return;

    const cards = Array.from(grid.querySelectorAll('.artikel-card, .article-card'));

    cards.forEach((card) => {
      if (prefersReducedMotion) {
        // Tampilkan langsung dalam bentuk final, tanpa animasi
        card.style.transform = 'translateY(0) scale(1)';
        card.style.borderRadius = `${getEndRadius()}px`;
        card.style.opacity = '1';
        card.classList.add('is-formed');
        const isi = card.querySelector('.artikel-card__isi');
        if (isi) isi.style.opacity = 1;
        return;
      }

      // KUNCI PERBAIKAN: Setiap kartu bind progress-nya SENDIRI,
      // berdasarkan POSISI KARTU ITU SENDIRI — bukan posisi grid keseluruhan.
      ScrollUtils.bindScrollProgress(
        card,
        (progress) => updateCardShape(card, progress),
        0.5
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
  } else {
    initCards();
  }

  // Recalculate saat resize (breakpoint berubah -> ukuran kartu berubah)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const cards = Array.from(grid.querySelectorAll('.artikel-card, .article-card'));
      cards.forEach((card) => delete card.dataset.startRadius);
    }, 150);
  });

  // Saat artikel di-render ulang oleh filter kategori atau pencarian
  document.addEventListener('articles-rendered', initCards);
  document.addEventListener('artikelGridDiperbarui', initCards);
})();
