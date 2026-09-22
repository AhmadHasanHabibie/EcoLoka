/**
 * ==========================================================================
 * ECOLOKA — DASHBOARD PEMANTAUAN LINGKUNGAN (pemantauan.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Fitur: Baca LocalStorage, Custom SVG Comparison Chart, Empty State Handler, Reset Data
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMonitoringDashboard();
});

function initMonitoringDashboard() {
  const emptyStateWrapper = document.getElementById('dashboard-empty-state');
  const userResultsWrapper = document.getElementById('dashboard-user-results');
  const resetBtn = document.getElementById('btn-reset-history');

  // Cek data di LocalStorage
  let storedData = null;
  try {
    const raw = localStorage.getItem('ecoloka_carbon_data');
    if (raw) storedData = JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca data dari LocalStorage:', e);
  }

  if (storedData && storedData.totalEmisi) {
    renderUserData(storedData);
  } else {
    showEmptyState();
  }

  // Tombol Buka Sertifikat Personal
  const certBtn = document.getElementById('btn-open-cert-dash');
  if (certBtn) {
    certBtn.addEventListener('click', () => {
      if (typeof window.openEcoCertificate === 'function') {
        const score = storedData ? storedData.totalEmisi : 1550;
        const tier = storedData ? storedData.tierName : 'Prajurit Rendah Karbon';
        window.openEcoCertificate({ score, tier });
      }
    });
  }

  // Tombol Hapus Riwayat
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mereset riwayat perhitungan jejak karbon Anda?')) {
        try {
          localStorage.removeItem('ecoloka_carbon_data');
        } catch (e) {}
        showEmptyState();
      }
    });
  }

  function showEmptyState() {
    if (emptyStateWrapper) emptyStateWrapper.style.display = 'block';
    if (userResultsWrapper) userResultsWrapper.style.display = 'none';
  }

  function renderUserData(data) {
    if (emptyStateWrapper) emptyStateWrapper.style.display = 'none';
    if (userResultsWrapper) userResultsWrapper.style.display = 'block';

    const userNumberEl = document.getElementById('dash-user-number');
    const userTierBadge = document.getElementById('dash-user-tier');
    const userDateEl = document.getElementById('dash-user-date');

    if (userNumberEl) userNumberEl.textContent = data.totalEmisi.toLocaleString('id-ID');
    if (userDateEl) userDateEl.textContent = data.formattedDate || 'Baru saja';

    if (userTierBadge) {
      let badgeClass = 'badge--sun';
      if (data.tierKey === 'rendah') badgeClass = 'badge--sprout';
      if (data.tierKey === 'tinggi') badgeClass = 'badge--warning';
      userTierBadge.className = `badge ${badgeClass}`;
      userTierBadge.textContent = data.tierName || 'Sedang';
    }

    // Hitung persentase untuk Grafik Batang Pembanding
    // Skala maksimal grafik: 4.000 kg CO2
    const MAX_SCALE = 4000;
    const userPercent = Math.min(Math.round((data.totalEmisi / MAX_SCALE) * 100), 100);
    const nationalPercent = Math.round((2300 / MAX_SCALE) * 100); // 57.5%
    const targetPercent = Math.round((1500 / MAX_SCALE) * 100);   // 37.5%

    const barUser = document.getElementById('bar-fill-user');
    const barNational = document.getElementById('bar-fill-national');
    const barTarget = document.getElementById('bar-fill-target');

    const valUser = document.getElementById('bar-val-user');
    if (valUser) valUser.textContent = `${data.totalEmisi.toLocaleString('id-ID')} kg CO₂/thn`;

    // Render bar transisi animasi
    setTimeout(() => {
      if (barUser) barUser.style.width = `${userPercent}%`;
      if (barNational) barNational.style.width = `${nationalPercent}%`;
      if (barTarget) barTarget.style.width = `${targetPercent}%`;
    }, 150);

    // Breakdown rincian
    if (data.breakdown) {
      const transEl = document.getElementById('breakdown-trans');
      const energyEl = document.getElementById('breakdown-energy');
      const foodEl = document.getElementById('breakdown-food');

      if (transEl && data.breakdown.transport) {
        transEl.textContent = `${data.breakdown.transport.val} kg (${data.breakdown.transport.label})`;
      }
      if (energyEl && data.breakdown.energy) {
        energyEl.textContent = `${data.breakdown.energy.val} kg (${data.breakdown.energy.label})`;
      }
      if (foodEl && data.breakdown.food) {
        foodEl.textContent = `${data.breakdown.food.val} kg (${data.breakdown.food.label})`;
      }
    }
  }
}
