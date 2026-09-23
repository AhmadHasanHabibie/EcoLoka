/**
 * ==========================================================================
 * ECOLOKA — KALKULATOR JEJAK KARBON MULTI-STEP (kalkulator.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Fitur: Multi-Step Navigation, Client-Side Scoring, SVG Gauge, LocalStorage, Rekomendasi
 * ==========================================================================
 * 
 * ASUMSI METODOLOGI PERHITUNGAN EMISI (Standar Nasional Indonesia & IPCC):
 * 1. Transportasi:
 *    - Jalan Kaki / Sepeda: 0 kg CO₂e/tahun
 *    - Transportasi Umum: ~350 kg CO₂e/tahun (efisiensi penumpang massal)
 *    - Sepeda Motor Bensin: ~750 kg CO₂e/tahun (faktor emisi ~0.08 kg/km, rata-rata 25 km/hari)
 *    - Mobil Pribadi Bensin: ~1.800 kg CO₂e/tahun (faktor emisi ~0.20 kg/km)
 * 2. Konsumsi Listrik Rumah Tangga:
 *    - Sangat Hemat (Tanpa AC): ~400 kg CO₂e/tahun
 *    - Sedang (1 AC terukur, elektronik harian): ~850 kg CO₂e/tahun
 *    - Tinggi (Banyak AC, water heater, perangkat siaga): ~1.600 kg CO₂e/tahun
 * 3. Pola Konsumsi & Sampah:
 *    - Diet Nabati & Zero-Waste: ~300 kg CO₂e/tahun
 *    - Campuran Rata-rata Indonesia: ~650 kg CO₂e/tahun
 *    - Tinggi Daging Merah & Kemasan Sekali Pakai: ~1.200 kg CO₂e/tahun
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCarbonCalculator();
});

function initCarbonCalculator() {
  const form = document.getElementById('carbon-calc-form');
  const panels = document.querySelectorAll('.multistep__panel');
  const stepIndicators = document.querySelectorAll('.multistep__step');
  const resultCard = document.getElementById('calc-result-section');

  if (!form || !panels.length) return;

  let currentStep = 1;
  const totalSteps = 3;

  // Nilai pilihan pengguna
  const userAnswers = {
    transport: { val: 0, label: '' },
    energy: { val: 0, label: '' },
    food: { val: 0, label: '' }
  };

  // Dataset Rekomendasi Fallback (CORS-Safe untuk file://)
  const fallbackRecommendations = {
    rendah: {
      tier: 'Rendah (Green Hero)',
      deskripsi: 'Luar biasa! Jejak emisi karbon tahunan Anda berada di bawah ambang batas aman pemanasan global (< 1.500 kg CO₂/tahun). Anda adalah teladan gaya hidup hijau ramah lingkungan.',
      rekomendasi: [
        {
          judul: 'Menjadi Duta Edukasi Komunitas',
          deskripsi: 'Bagikan kiat gaya hidup hemat energi dan minim sampah Anda kepada teman sebaya dan tetangga sekitar.',
          ikon: 'fa-solid fa-bullhorn'
        },
        {
          judul: 'Eksplorasi Urban Farming Mandiri',
          deskripsi: 'Mulai menanam sayuran herbal organik di pot atau hidroponik pekarangan untuk memangkas emisi logistik pangan.',
          ikon: 'fa-solid fa-seedling'
        },
        {
          judul: 'Mendukung Komposting Lingkungan',
          deskripsi: 'Ajak RT/RW setempat menginisiasi tempat pengolahan sampah organik terpadu untuk pupuk taman kota.',
          ikon: 'fa-solid fa-recycle'
        }
      ]
    },
    sedang: {
      tier: 'Sedang (Eco Learner)',
      deskripsi: 'Jejak emisi Anda berada pada kisaran 1.500 – 2.800 kg CO₂/tahun, mendekati rata-rata penduduk perkotaan di Indonesia (2.300 kg CO₂/tahun). Anda berpotensi besar menekan emisi menjadi kategori Rendah.',
      rekomendasi: [
        {
          judul: 'Satu Hari Tanpa Kendaraan Bermotor Pribadi',
          deskripsi: 'Terapkan satu hari dalam seminggu untuk berjalan kaki, bersepeda, atau naik transportasi umum saat bepergian.',
          ikon: 'fa-solid fa-bicycle'
        },
        {
          judul: 'Optimasi Suhu Pendingin Ruangan (AC)',
          deskripsi: 'Atur suhu AC pada 24°C–25°C dan manfaatkan timer otomatis matikan 1 jam sebelum bangun tidur untuk memangkas listrik hingga 15%.',
          ikon: 'fa-solid fa-snowflake'
        },
        {
          judul: 'Bawa Botol dan Wadah Makanan Sendiri',
          deskripsi: 'Hentikan pembelian air minum dalam botol plastik sekali pakai dan kurangi kemasan makanan styrofoam harian.',
          ikon: 'fa-solid fa-bottle-water'
        }
      ]
    },
    tinggi: {
      tier: 'Tinggi (Carbon Alert)',
      deskripsi: 'Jejak emisi karbon Anda melampaui 2.800 kg CO₂/tahun. Penggunaan kendaraan berbahan bakar fosil dan konsumsi energi rumah tangga Anda memerlukan aksi intervensi segera.',
      rekomendasi: [
        {
          judul: 'Transisi ke Transportasi Massal / Carpooling',
          deskripsi: 'Beralihlah ke transportasi umum (Trans/KRL/Bus) atau berbagi tumpangan (carpooling) untuk memangkas emisi bensin harian hingga 60%.',
          ikon: 'fa-solid fa-bus'
        },
        {
          judul: 'Audit dan Putus Daya Listrik Siaga (Vampire Draw)',
          deskripsi: 'Cabut colokan charger, matikan sakelar TV dan komputer yang tidak digunakan, serta ganti seluruh lampu ke tipe LED hemat energi.',
          ikon: 'fa-solid fa-plug'
        },
        {
          judul: 'Kurangi Daging Merah & Minimalisir Sisa Makanan',
          deskripsi: 'Terapkan konsep "Meatless Monday" dan rencanakan belanja dapur secara cermat agar tidak ada makanan yang terbuang percuma ke tempat sampah.',
          ikon: 'fa-solid fa-utensils'
        }
      ]
    }
  };

  // Setup tombol Next, Prev, Recalculate, dan Cetak Sertifikat
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');
  const recalculateBtn = document.getElementById('btn-recalculate');
  const openCertBtn = document.getElementById('btn-open-cert');

  let currentCalculatedResult = {
    total: 0,
    tier: ''
  };

  // Expose hasil kalkulasi untuk diakses template cetak sertifikat
  window.EcoLokaKalkulator = {
    get hasilEmisiTerakhir() {
      if (currentCalculatedResult && currentCalculatedResult.total) {
        return currentCalculatedResult.total.toLocaleString('id-ID');
      }
      try {
        const stored = JSON.parse(localStorage.getItem('ecoloka_carbon_data'));
        if (stored && stored.totalEmisi) return stored.totalEmisi.toLocaleString('id-ID');
      } catch (e) {}
      return '1.240';
    },
    get kategoriTerakhir() {
      if (currentCalculatedResult && currentCalculatedResult.tier) {
        return currentCalculatedResult.tier;
      }
      try {
        const stored = JSON.parse(localStorage.getItem('ecoloka_carbon_data'));
        if (stored && stored.tierName) return stored.tierName;
      } catch (e) {}
      return 'Prajurit Rendah Karbon';
    }
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        } else {
          // Hitung hasil final
          calculateAndDisplayResult();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  if (recalculateBtn) {
    recalculateBtn.addEventListener('click', () => {
      if (resultCard) resultCard.style.display = 'none';
      const multistepBox = document.querySelector('.multistep');
      if (multistepBox) multistepBox.style.display = 'block';
      goToStep(1);
    });
  }

  // Validasi opsi di langkah saat ini
  function validateCurrentStep(step) {
    let inputName = '';
    if (step === 1) inputName = 'transport_choice';
    if (step === 2) inputName = 'energy_choice';
    if (step === 3) inputName = 'food_choice';

    const selected = form.querySelector(`input[name="${inputName}"]:checked`);
    const errorMsg = document.getElementById(`step-${step}-error`);

    if (!selected) {
      if (errorMsg) {
        errorMsg.style.display = 'flex';
        errorMsg.textContent = 'Harap pilih salah satu kebiasaan Anda untuk melanjutkan.';
      }
      return false;
    }

    if (errorMsg) errorMsg.style.display = 'none';

    // Simpan nilai
    const val = parseInt(selected.value, 10) || 0;
    const label = selected.getAttribute('data-label') || '';

    if (step === 1) userAnswers.transport = { val, label };
    if (step === 2) userAnswers.energy = { val, label };
    if (step === 3) userAnswers.food = { val, label };

    return true;
  }

  // Navigasi langkah
  function goToStep(step) {
    currentStep = step;

    panels.forEach(p => p.classList.remove('is-active'));
    const targetPanel = document.getElementById(`panel-step-${step}`);
    if (targetPanel) targetPanel.classList.add('is-active');

    stepIndicators.forEach((ind, idx) => {
      const stepIndex = idx + 1;
      ind.classList.remove('is-active', 'is-completed');
      if (stepIndex === currentStep) {
        ind.classList.add('is-active');
      } else if (stepIndex < currentStep) {
        ind.classList.add('is-completed');
      }
    });

    window.scrollTo({
      top: form.offsetTop - 100,
      behavior: 'smooth'
    });
  }

  // Kalkulasi dan Visualisasi Hasil
  function calculateAndDisplayResult() {
    const totalEmisi = userAnswers.transport.val + userAnswers.energy.val + userAnswers.food.val;

    let tierKey = 'sedang';
    let badgeClass = 'badge--sun';
    let needleDeg = 0; // derajat jarum: -75deg (hijau/rendah), 0deg (sedang), +75deg (merah/tinggi)

    if (totalEmisi < 1500) {
      tierKey = 'rendah';
      badgeClass = 'badge--sprout';
      needleDeg = -75;
    } else if (totalEmisi <= 2800) {
      tierKey = 'sedang';
      badgeClass = 'badge--sun';
      needleDeg = 0;
    } else {
      tierKey = 'tinggi';
      badgeClass = 'badge--warning';
      needleDeg = 75;
    }

    // Ambil data rekomendasi (fetch dengan fallback)
    fetch('assets/data/rekomendasi.json')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        renderResults(totalEmisi, tierKey, badgeClass, needleDeg, data[tierKey] || fallbackRecommendations[tierKey]);
      })
      .catch(() => {
        renderResults(totalEmisi, tierKey, badgeClass, needleDeg, fallbackRecommendations[tierKey]);
      });
  }

  function renderResults(total, tierKey, badgeClass, needleDeg, tierData) {
    currentCalculatedResult = {
      total: total,
      tier: tierData && tierData.tier ? tierData.tier : 'Pejuang Rendah Karbon'
    };

    const multistepBox = document.querySelector('.multistep');
    if (multistepBox) multistepBox.style.display = 'none';
    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update elemen DOM hasil
    const numDisplay = document.getElementById('res-carbon-number');
    const tierBadge = document.getElementById('res-tier-badge');
    const tierDesc = document.getElementById('res-tier-desc');
    const needle = document.getElementById('res-gauge-needle');
    const recContainer = document.getElementById('res-recommendations-list');

    // Animasi angka emisi
    if (numDisplay) {
      animateValue(numDisplay, 0, total, 1000);
    }

    if (tierBadge) {
      tierBadge.className = `badge ${badgeClass}`;
      tierBadge.textContent = tierData.tier;
    }

    if (tierDesc) {
      tierDesc.textContent = tierData.deskripsi;
    }

    // Putar jarum gauge SVG
    if (needle) {
      setTimeout(() => {
        needle.style.transform = `rotate(${needleDeg}deg)`;
      }, 200);
    }

    // Render kartu rekomendasi
    if (recContainer && tierData.rekomendasi) {
      recContainer.innerHTML = tierData.rekomendasi.map(item => `
        <div class="rec-card">
          <div class="rec-card__icon">
            <i class="${escapeHtml(item.ikon)}"></i>
          </div>
          <div style="flex-grow: 1;">
            <h4 class="rec-card__title">${escapeHtml(item.judul)}</h4>
            <p class="rec-card__desc">${escapeHtml(item.deskripsi)}</p>
          </div>
        </div>
      `).join('');
    }

    // Simpan ke LocalStorage untuk ditampilkan di halaman Dashboard Pemantauan
    const storagePayload = {
      totalEmisi: total,
      tierKey: tierKey,
      tierName: tierData.tier,
      breakdown: {
        transport: userAnswers.transport,
        energy: userAnswers.energy,
        food: userAnswers.food
      },
      timestamp: new Date().toISOString(),
      formattedDate: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
    };

    try {
      localStorage.setItem('ecoloka_carbon_data', JSON.stringify(storagePayload));
    } catch (e) {
      console.warn('LocalStorage tidak dapat diakses:', e);
    }
  }

  // Animasi hitung angka
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      obj.textContent = currentVal.toLocaleString('id-ID');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

/**
 * ==========================================================================
 * MODUL SERTIFIKAT KOMITMEN: MODAL INPUT NAMA + CETAK VIA WINDOW.PRINT()
 * (Native browser, tanpa library eksternal). Sertifikat lengkap TIDAK PERNAH
 * tampil di alur halaman normal — hanya aktif secara visual saat mode print,
 * dikontrol penuh oleh CSS `@media print`.
 * ==========================================================================
 */
(function () {
  function initSertifikatModal() {
    const btnBukaModal = document.getElementById('btnCetakSertifikat') || document.getElementById('btn-open-cert');
    const modal = document.getElementById('modalSertifikat');
    const inputNama = document.getElementById('inputNamaSertifikat');
    const errorNama = document.getElementById('errorNamaSertifikat');
    const btnBatal = document.getElementById('btnBatalSertifikat');
    const btnTutup = document.getElementById('btnTutupModal');
    const btnKonfirmasi = document.getElementById('btnKonfirmasiSertifikat');

    if (!btnBukaModal || !modal) return;

    let elementSebelumModal = null; // untuk mengembalikan fokus setelah modal ditutup

    function bukaModal() {
      elementSebelumModal = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      if (inputNama) {
        inputNama.value = '';
        setTimeout(() => inputNama.focus(), 150);
      }
      if (errorNama) errorNama.hidden = true;
      document.addEventListener('keydown', handleEscape);
    }

    function tutupModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', handleEscape);
      if (elementSebelumModal) elementSebelumModal.focus();
    }

    function handleEscape(e) {
      if (e.key === 'Escape') tutupModal();
    }

    function generateNomorVerifikasi() {
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `ECOLOKA-INV26-${random}`;
    }

    function formatTanggalHariIni() {
      const opsi = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date().toLocaleDateString('id-ID', opsi);
    }

    function isiTemplateSertifikat(nama) {
      const hasilEmisi = window.EcoLokaKalkulator?.hasilEmisiTerakhir ?? '1.240';
      const hasilKategori = window.EcoLokaKalkulator?.kategoriTerakhir ?? 'Prajurit Rendah Karbon';

      const certNamaEl = document.getElementById('certNama');
      const certEmisiEl = document.getElementById('certEmisi');
      const certKategoriEl = document.getElementById('certKategori');
      const certTanggalEl = document.getElementById('certTanggal');
      const certNomorEl = document.getElementById('certNomor');

      if (certNamaEl) certNamaEl.textContent = nama;
      if (certEmisiEl) certEmisiEl.textContent = `${hasilEmisi} kg CO₂e/thn`;
      if (certKategoriEl) certKategoriEl.textContent = hasilKategori;
      if (certTanggalEl) certTanggalEl.textContent = formatTanggalHariIni();
      if (certNomorEl) certNomorEl.textContent = generateNomorVerifikasi();
    }

    function konfirmasiDanCetak() {
      const nama = inputNama ? inputNama.value.trim() : '';
      if (nama === '') {
        if (errorNama) errorNama.hidden = false;
        if (inputNama) inputNama.focus();
        return;
      }

      isiTemplateSertifikat(nama);
      tutupModal();

      // Beri jeda singkat agar modal benar-benar tertutup secara visual
      // sebelum dialog print browser muncul — transisi terasa mulus, tidak tumpang tindih
      setTimeout(() => {
        window.print();
      }, 250);
    }

    btnBukaModal.addEventListener('click', bukaModal);
    if (btnBatal) btnBatal.addEventListener('click', tutupModal);
    if (btnTutup) btnTutup.addEventListener('click', tutupModal);
    if (btnKonfirmasi) btnKonfirmasi.addEventListener('click', konfirmasiDanCetak);

    // Klik di luar modal box (di area overlay gelap) juga menutup modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) tutupModal();
    });

    // Enter di input nama langsung memicu konfirmasi (kenyamanan tambahan)
    if (inputNama) {
      inputNama.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') konfirmasiDanCetak();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSertifikatModal);
  } else {
    initSertifikatModal();
  }
})();

