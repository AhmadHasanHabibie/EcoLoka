/**
 * ==========================================================================
 * ECOLOKA — ANIMASI POHON TUMBUH BERPUTAR (animasi-tiga-pilar.js)
 * Fitur: Animasi Pohon Tumbuh 3 Tahap (Akar -> Batang -> Tajuk)
 * Sinkronisasi: 3 Kartu Pilar Utama Ekosistem EcoLoka
 * Mekanisme: Natural Scroll-Linked (Zero Sticky-Pinning) via ScrollUtils
 * Arsitektur: 100% Vanilla JS Murni & Native SVG (Progressive Enhancement)
 * Kepatuhan: WCAG AA, prefers-reduced-motion, Zero External Library
 * ==========================================================================
 */

(function () {
  'use strict';

  // Feature detection sederhana — hanya jalankan animasi jika API yang dibutuhkan didukung
  const isSupported =
    'IntersectionObserver' in window && 'requestAnimationFrame' in window;
  if (!isSupported) return; // Biarkan CSS default (statis, semua terlihat) yang berlaku

  const section = document.getElementById('tigaPilar');
  if (!section) return;

  const container = section.querySelector('.tiga-pilar__container');
  if (!container) return;

  // Aktifkan state animasi interaktif secara progresif
  container.classList.add('js-animasi-aktif');

  const tahapAkar = document.getElementById('tahap-akar');
  const tahapBatang = document.getElementById('tahap-batang');
  const daunList = Array.from(
    document.querySelectorAll('#tahap-tajuk .daun')
  );
  const pilarCards = [
    document.getElementById('pilarCard-1'),
    document.getElementById('pilarCard-2'),
    document.getElementById('pilarCard-3'),
  ];

  /**
   * Menyiapkan panjang path untuk efek stroke-drawing berbasis getTotalLength().
   * Menyimpan properti custom --path-length ke elemen SVG.
   * 
   * @param {SVGElement} group
   */
  function setupPathLength(group) {
    if (!group) return;
    const paths = group.querySelectorAll('path, line');
    paths.forEach((path) => {
      if (typeof path.getTotalLength === 'function') {
        const length = Math.ceil(path.getTotalLength());
        path.style.setProperty('--path-length', length);
      }
    });

    const firstPath = group.querySelector('path, line');
    if (firstPath && typeof firstPath.getTotalLength === 'function') {
      const length = Math.ceil(firstPath.getTotalLength());
      group.style.setProperty('--path-length', length);
    }
  }

  setupPathLength(tahapAkar);
  setupPathLength(tahapBatang);

  /**
   * Membatasi nilai progress antara 0.0 dan 1.0
   * @param {number} value
   * @returns {number}
   */
  function clampProgress(value) {
    return Math.max(0, Math.min(1, value));
  }

  /**
   * Menghitung dan menerapkan frame animasi pertumbuhan pohon
   * berdasarkan progress scroll keseluruhan section (0..1).
   * 
   * @param {number} overallProgress
   */
  function updateGrowth(overallProgress) {
    // Bagi progress keseluruhan menjadi 3 segmen terurut:
    // 1. Akar (0.00 - 0.33)
    // 2. Batang (0.33 - 0.66)
    // 3. Tajuk & Daun (0.66 - 1.00)
    const progressAkar = clampProgress(overallProgress / 0.33);
    const progressBatang = clampProgress((overallProgress - 0.33) / 0.33);
    const progressTajuk = clampProgress((overallProgress - 0.66) / 0.34);

    // --- TAHAP 1: AKAR & BENIH (0% – 33%) ---
    if (tahapAkar) {
      const defaultLengthAkar = getComputedStyle(tahapAkar).getPropertyValue(
        '--path-length'
      ) || '1000';
      
      // Sedikit rotasi grup akar dari -8deg ke 0deg (efek menancap/mengakar alami)
      const rotasiAkar = ScrollUtils.lerp(-8, 0, progressAkar);
      tahapAkar.style.transform = `rotate(${rotasiAkar}deg)`;

      const pathsAkar = tahapAkar.querySelectorAll('path, line');
      const easeAkar = ScrollUtils.easeOutCubic(progressAkar);

      pathsAkar.forEach((pathAkar) => {
        const len = parseFloat(
          pathAkar.style.getPropertyValue('--path-length') || defaultLengthAkar
        );
        pathAkar.style.strokeDashoffset = len * (1 - easeAkar);
      });
    }

    // --- TAHAP 2: BATANG & CABANG (33% – 66%) ---
    if (tahapBatang) {
      const defaultLengthBatang = getComputedStyle(tahapBatang).getPropertyValue(
        '--path-length'
      ) || '1000';
      
      // Meninggi vertikal (scaleY dari 0.85 ke 1) seiring batang tumbuh ke atas
      const scaleYBatang = ScrollUtils.lerp(0.85, 1, progressBatang);
      tahapBatang.style.transform = `scaleY(${scaleYBatang})`;

      const pathsBatang = tahapBatang.querySelectorAll('path, line');
      const easeBatang = ScrollUtils.easeOutCubic(progressBatang);

      pathsBatang.forEach((pathBatang) => {
        const len = parseFloat(
          pathBatang.style.getPropertyValue('--path-length') || defaultLengthBatang
        );
        pathBatang.style.strokeDashoffset = len * (1 - easeBatang);
      });
    }

    // --- TAHAP 3: TAJUK & DAUN MEKAR BERPUTAR (66% – 100%) ---
    // Daun berputar dari rotate(-90deg) "kuncup terlipat" menjadi rotate(0deg) "mekar penuh"
    const staggerPerDaun = 0.15;
    daunList.forEach((daun, index) => {
      const startDelay = index * staggerPerDaun;
      let daunProgress = (progressTajuk - startDelay) / (1 - startDelay || 1);
      daunProgress = ScrollUtils.easeOutCubic(clampProgress(daunProgress));

      const rotate = ScrollUtils.lerp(-90, 0, daunProgress);
      const scale = ScrollUtils.lerp(0.6, 1, daunProgress);
      daun.style.transform = `rotate(${rotate}deg) scale(${scale})`;
      daun.style.opacity = daunProgress;
    });

    // --- SINKRONISASI KARTU PILAR (SINKRON 1:1 DENGAN TAHAP POHON) ---
    const isMobile = window.innerWidth < 768;
    const segmentProgress = [progressAkar, progressBatang, progressTajuk];
    pilarCards.forEach((card, index) => {
      if (!card) return;
      let p = ScrollUtils.easeOutCubic(segmentProgress[index]);
      if (isMobile) {
        // Pada mobile, perhitungkan juga posisi card aktual agar solid saat berada di tengah layar
        const cardProg = ScrollUtils.hitungProgress(card);
        p = Math.max(p, cardProg);
      }
      card.style.opacity = p;
      card.style.transform = `translateX(${ScrollUtils.lerp(24, 0, p)}px)`;

      // Kelas dekoratif bila pilar telah terbuka
      if (p >= 0.85) {
        card.classList.add('is-pilar-revealed');
      } else {
        card.classList.remove('is-pilar-revealed');
      }
    });
  }

  // Daftarkan listener scroll dengan throttling requestAnimationFrame via ScrollUtils
  if (typeof ScrollUtils !== 'undefined' && typeof ScrollUtils.bindScrollProgress === 'function') {
    ScrollUtils.bindScrollProgress(section, updateGrowth, 0.5);
  } else {
    // Fallback jika ScrollUtils dimuat asinkron: tunggu DOMContentLoaded atau window.load
    window.addEventListener('load', () => {
      if (typeof ScrollUtils !== 'undefined' && typeof ScrollUtils.bindScrollProgress === 'function') {
        ScrollUtils.bindScrollProgress(section, updateGrowth, 0.5);
      }
    });
  }
})();
