/**
 * ==========================================================================
 * ECOLOKA — KOMUNITAS & KAMPANYE HIJAU (komunitas.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Fitur: Dynamic Campaign Cards, Validasi Form Partisipasi, LocalStorage Draft, Progress Counter
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCommunityHub();
});

function initCommunityHub() {
  const campaignsGrid = document.getElementById('campaigns-grid');
  const partForm = document.getElementById('community-form');
  const successNotice = document.getElementById('form-success-notice');

  // Fallback data kampanye (CORS-Safe untuk file://)
  const fallbackCampaigns = [
    {
      id: 'kampanye-mangrove-bali',
      judul: 'Aksi Restorasi 1.000 Bibit Mangrove Pesisir',
      kategori: 'Konservasi Pesisir',
      lokasi: 'Denpasar & Teluk Benoa, Bali',
      tanggal: '27 September 2026',
      peserta_terdaftar: 142,
      target_peserta: 200,
      persentase: 71,
      ikon: 'fa-solid fa-water',
      ringkasan: 'Gerakan penanaman bibit bakau bersama pelajar SMA dan mahasiswa untuk menahan abrasi pantai serta menyerap karbon biru (blue carbon) pesisir.',
      status: 'Pendaftaran Dibuka'
    },
    {
      id: 'gerakan-pilah-sampah-sekolah',
      judul: 'Kompetisi Bank Sampah Digital Antar Sekolah',
      kategori: 'Pengelolaan Sampah',
      lokasi: 'Nasional (Daring / Hybrid)',
      tanggal: '1 – 31 Oktober 2026',
      peserta_terdaftar: 38,
      target_peserta: 50,
      persentase: 76,
      ikon: 'fa-solid fa-school',
      ringkasan: 'Program pemilahan sampah anorganik di sekolah menengah dengan pencatatan bobot digital terpusat untuk memperebutkan Green School Award 2026.',
      status: 'Pendaftaran Dibuka'
    },
    {
      id: 'gowes-bebas-emisi',
      judul: 'Bike to School / Work: Sepekan Bebas Polusi',
      kategori: 'Transportasi Hijau',
      lokasi: 'Berbagai Kota di Indonesia',
      tanggal: '12 – 18 Oktober 2026',
      peserta_terdaftar: 520,
      target_peserta: 600,
      persentase: 87,
      ikon: 'fa-solid fa-bicycle',
      ringkasan: 'Tantangan komutasi harian tanpa kendaraan bermotor pribadi. Catat jarak kayuhan Anda di dashboard EcoLoka untuk kalkulasi reduksi emisi gabungan.',
      status: 'Segera Dimulai'
    },
    {
      id: 'workshop-ecobrick-kreatif',
      judul: 'Workshop Pengolahan Residu Plastik Menjadi Ecobrick',
      kategori: 'Daur Ulang',
      lokasi: 'Kampus Bukit Jimbaran, Universitas Udayana',
      tanggal: '24 Oktober 2026',
      peserta_terdaftar: 85,
      target_peserta: 100,
      persentase: 85,
      ikon: 'fa-solid fa-cubes-stacked',
      ringkasan: 'Pelatihan memadatkan sampah sachet plastik tak bernilai jual ke dalam botol PET menjadi modul bata modular ramah lingkungan untuk kursi taman.',
      status: 'Pendaftaran Dibuka'
    }
  ];

  // Muat data kampanye
  if (campaignsGrid) {
    fetch('assets/data/komunitas.json')
      .then(res => {
        if (!res.ok) throw new Error('Fetch error');
        return res.json();
      })
      .then(data => renderCampaigns(data))
      .catch(() => renderCampaigns(fallbackCampaigns));
  }

  function renderCampaigns(campaigns) {
    campaignsGrid.innerHTML = campaigns.map(item => `
      <article class="campaign-card">
        <div class="campaign-card__header">
          <div class="campaign-card__icon">
            <i class="${escapeHtml(item.ikon)}"></i>
          </div>
          <span class="badge badge--sprout">${escapeHtml(item.status)}</span>
        </div>

        <h3 class="campaign-card__title">${escapeHtml(item.judul)}</h3>
        <p class="campaign-card__desc">${escapeHtml(item.ringkasan)}</p>

        <div class="campaign-card__meta">
          <div class="campaign-card__meta-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>${escapeHtml(item.lokasi)}</span>
          </div>
          <div class="campaign-card__meta-item">
            <i class="fa-regular fa-calendar"></i>
            <span>${escapeHtml(item.tanggal)}</span>
          </div>
        </div>

        <div class="progress-label">
          <span>Partisipasi: <strong>${item.peserta_terdaftar}</strong> / ${item.target_peserta} Relawan</span>
          <span class="u-text-leaf">${item.persentase}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${item.persentase}%;"></div>
        </div>

        <a href="#daftar-relawan" class="btn btn--secondary btn--sm" style="margin-top: auto; justify-content: center;" onclick="prefillCampaign('${escapeHtml(item.judul)}')">
          <i class="fa-solid fa-user-plus"></i>
          <span>Ikut Aksi Ini</span>
        </a>
      </article>
    `).join('');
  }

  // Pre-fill nama kampanye saat tombol diklik
  window.prefillCampaign = function(title) {
    const selectEl = document.getElementById('com-campaign-select');
    if (selectEl) {
      for (let i = 0; i < selectEl.options.length; i++) {
        if (selectEl.options[i].text.includes(title) || selectEl.options[i].value.includes(title)) {
          selectEl.selectedIndex = i;
          break;
        }
      }
    }
  };

  // Validasi Form Partisipasi (Client-Side)
  if (partForm) {
    partForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      const nameInput = document.getElementById('com-name');
      const emailInput = document.getElementById('com-email');
      const campaignSelect = document.getElementById('com-campaign-select');
      const commitmentInput = document.getElementById('com-commitment');

      // Validasi Nama
      if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        showError('com-name', 'Nama lengkap minimal 3 karakter.');
        isValid = false;
      } else {
        clearError('com-name');
      }

      // Validasi Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showError('com-email', 'Harap masukkan format alamat email yang valid.');
        isValid = false;
      } else {
        clearError('com-email');
      }

      // Validasi Pilihan Kampanye
      if (!campaignSelect.value) {
        showError('com-campaign-select', 'Harap pilih salah satu inisiatif kampanye.');
        isValid = false;
      } else {
        clearError('com-campaign-select');
      }

      // Validasi Komitmen
      if (!commitmentInput.value.trim() || commitmentInput.value.trim().length < 10) {
        showError('com-commitment', 'Tuliskan komitmen atau motivasi Anda (minimal 10 karakter).');
        isValid = false;
      } else {
        clearError('com-commitment');
      }

      if (isValid) {
        // Simpan draf ke LocalStorage
        const draft = {
          nama: nameInput.value.trim(),
          email: emailInput.value.trim(),
          kampanye: campaignSelect.value,
          komitmen: commitmentInput.value.trim(),
          waktu: new Date().toISOString()
        };

        try {
          localStorage.setItem('ecoloka_volunteer_draft', JSON.stringify(draft));
        } catch (err) {}

        // Tampilkan Pesan Sukses Dinamis
        partForm.reset();
        if (successNotice) {
          successNotice.style.display = 'block';
          successNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  function showError(fieldId, msg) {
    const parent = document.getElementById(fieldId)?.closest('.form-group');
    if (parent) {
      parent.classList.add('has-error');
      const feedback = parent.querySelector('.form-feedback--error');
      if (feedback) feedback.textContent = msg;
    }
  }

  function clearError(fieldId) {
    const parent = document.getElementById(fieldId)?.closest('.form-group');
    if (parent) {
      parent.classList.remove('has-error');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
