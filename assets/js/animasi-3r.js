/**
 * ==========================================================================
 * ECOLOKA — ANIMASI 3R SCROLL-LINKED (animasi-3r.js) - REFAKTOR
 * Fitur: "Dari Garis Lurus Menjadi Siklus" (Reduce → Reuse → Recycle)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Arsitektur: 100% Client-Side Vanilla JavaScript (Zero Library Terlarang)
 * 
 * Menggunakan ScrollUtils (shared utility) untuk kalkulasi progress viewport.
 * ==========================================================================
 */

(function () {
  'use strict';

  function init3RAnimation() {
    const section = document.getElementById('transisi3r');
    if (!section || typeof ScrollUtils === 'undefined') return;

    const arrowReduce = document.getElementById('arrow-reduce');
    const arrowReuse = document.getElementById('arrow-reuse');
    const arrowRecycle = document.getElementById('arrow-recycle');
    const labels = document.querySelectorAll('.r-label');
    const caption = document.getElementById('caption-3r');

    // Definisi koordinat awal (LURUS) & akhir (SEGITIGA SIKLUS) per panah
    // Titik acuan rotasi & translasi berada di pusat SVG viewBox (200, 200)
    const STATE_START = {
      reduce:  { x: -110, y: 0,  rotate: 0 },
      reuse:   { x: 0,    y: 0,  rotate: 0 },
      recycle: { x: 110,  y: 0,  rotate: 0 }
    };

    const STATE_END = {
      reduce:  { x: 0,    y: -90, rotate: 0 },
      reuse:   { x: 78,   y: 45,  rotate: 120 },
      recycle: { x: -78,  y: 45,  rotate: 240 }
    };

    /**
     * Menerapkan transformasi translasi dan rotasi ke elemen panah SVG
     */
    function applyTransform(el, startState, endState, progress) {
      if (!el) return;
      const x = ScrollUtils.lerp(startState.x, endState.x, progress);
      const y = ScrollUtils.lerp(startState.y, endState.y, progress);
      const rotate = ScrollUtils.lerp(startState.rotate, endState.rotate, progress);
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    }

    /**
     * Memperbarui seluruh komponen visual berdasarkan progress scroll (0..1)
     */
    function updateAnimation(rawProgress) {
      const easedProgress = ScrollUtils.easeOutCubic(rawProgress);

      // 1. Transformasi ketiga panah
      applyTransform(arrowReduce, STATE_START.reduce, STATE_END.reduce, easedProgress);
      applyTransform(arrowReuse, STATE_START.reuse, STATE_END.reuse, easedProgress);
      applyTransform(arrowRecycle, STATE_START.recycle, STATE_END.recycle, easedProgress);

      // 2. Sinkronisasi Fade-in Label (muncul saat segitiga hampir terbentuk sempurna > 0.82)
      const labelOpacity = rawProgress > 0.82 ? Math.min(1, (rawProgress - 0.82) / 0.18) : 0;
      labels.forEach((label) => {
        label.style.opacity = labelOpacity;
      });

      // 3. Sinkronisasi Caption ("Tiga aksi. Satu siklus. Satu bumi.")
      if (caption) {
        caption.style.opacity = labelOpacity;
      }
    }

    // Registrasi progress scroll dengan target 45% viewport height
    ScrollUtils.bindScrollProgress(section, updateAnimation, 0.45);
  }

  // Inisialisasi saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3RAnimation);
  } else {
    init3RAnimation();
  }
})();
