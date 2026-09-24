/**
 * ==========================================================================
 * ECOLOKA — ANIMASI KARTU CTA Z-FOLD (animasi-lipat-cta.js)
 * Fitur: 3D Z-Fold Letter Unfold, Scroll Natural (Tanpa Pinning)
 * Section: Call To Action (Beranda EcoLoka)
 * 
 * Konsep:
 * Seluruh konten kartu CTA "terlipat" seperti surat Z-fold tiga lipatan,
 * lalu terbuka berurutan dari atas ke bawah mengikuti progress scroll.
 * Ukuran kartu (bingkai hijau) TIDAK berubah, hanya konten di dalamnya
 * yang beranimasi via rotateX — ringan, 60fps mulus, tanpa reflow layout.
 * 
 * Kepatuhan:
 * - 100% Native Vanilla JS & Web Standards
 * - Progressive Enhancement: Default state adalah terbuka penuh (rotateX 0deg).
 * - Aksesibilitas: prefers-reduced-motion langsung menampilkan bentuk terbuka.
 * - Memakai ulang ScrollUtils dari assets/js/scroll-utils.js
 * ==========================================================================
 */

(function () {
  'use strict';

  // 1. Validasi dukungan fitur browser modern (Progressive Enhancement)
  const isSupported =
    'IntersectionObserver' in window &&
    'requestAnimationFrame' in window &&
    typeof ScrollUtils !== 'undefined';
  if (!isSupported) return;

  const section =
    document.getElementById('ctaSection') ||
    document.getElementById('gabung-aksi');
  if (!section) return;

  const fold1 = document.getElementById('ctaFold1');
  const fold2 = document.getElementById('ctaFold2');
  const fold3 = document.getElementById('ctaFold3');

  if (!fold1 || !fold2 || !fold3) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    [fold1, fold2, fold3].forEach((fold) => {
      fold.style.transform = 'rotateX(0deg)';
      fold.style.opacity = '1';
    });
    return;
  }

  // Sudut lipat awal: -85 derajat (hampir tegak lurus, menghindari z-fighting 90deg)
  const FOLD_START_ANGLE = -85;

  function updateFolds(overallProgress) {
    // Bagi progress menjadi 3 segmen sekuensial: lipatan 1, 2, 3
    const p1 = Math.max(0, Math.min(1, overallProgress / 0.33));
    const p2 = Math.max(0, Math.min(1, (overallProgress - 0.33) / 0.33));
    const p3 = Math.max(0, Math.min(1, (overallProgress - 0.66) / 0.34));

    const segments = [
      { el: fold1, p: p1 },
      { el: fold2, p: p2 },
      { el: fold3, p: p3 },
    ];

    segments.forEach(({ el, p }) => {
      const eased = ScrollUtils.easeOutCubic(p);
      const rotateX = ScrollUtils.lerp(FOLD_START_ANGLE, 0, eased);
      const opacity = ScrollUtils.lerp(0.15, 1, eased); // Saat terlipat redup (0.15), saat terbuka penuh (1.0)

      el.style.transform = `rotateX(${rotateX.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(2);
    });
  }

  // Selesai tepat saat kartu CTA berada di titik tengah viewport (fraction 0.5)
  ScrollUtils.bindScrollProgress(section, updateFolds, 0.5);
  updateFolds(ScrollUtils.calculateViewportProgress(section, 0.5));
})();
