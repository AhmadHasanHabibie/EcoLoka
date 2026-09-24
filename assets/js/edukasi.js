/**
 * ==========================================================================
 * ECOLOKA — EDUKASI INTERAKTIF (edukasi.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Fitur: Dynamic Fetch JSON, Filter Kategori, Real-Time Search, Accessible Modal
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initEducationHub();
});

function initEducationHub() {
  const articlesGrid = document.getElementById('artikelGrid') || document.getElementById('articles-grid');
  const searchInput = document.getElementById('article-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const modalBackdrop = document.getElementById('article-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalContent = document.getElementById('modal-dynamic-content');

  if (!articlesGrid) return;

  // State aplikasi
  let allArticles = [];
  let currentCategory = 'semua';
  let currentSearchQuery = '';

  // Dataset Fallback jika dibuka langsung via protokol file:/// (CORS-Safe)
  const fallbackArticles = [
    {
      id: 'sampah-organik-kompos',
      judul: 'Mengolah Sampah Organik Menjadi Kompos Rumahan Berkualitas',
      kategori: 'Sampah & Daur Ulang',
      kategori_slug: 'sampah',
      ringkasan: 'Lebih dari 50% timbunan sampah rumah tangga di Indonesia adalah sampah organik. Pelajari metode komposting sederhana tanpa bau dengan wadah ember bertingkat.',
      waktu_baca: '4 menit',
      ikon: 'fa-solid fa-recycle',
      tanggal: '18 September 2026',
      konten_lengkap: 'Sampah organik seperti sisa sayur, kulit buah, dan dedaunan sering kali berakhir di Tempat Pembuangan Akhir (TPA) dalam kondisi anaerobik (tanpa oksigen), sehingga melepaskan gas metana (CH₄) yang memiliki potensi pemanasan global 28 kali lebih kuat daripada karbon dioksida.\n\n### Langkah Pembuatan Kompos Ember:\n\n1. Sediakan Wadah Berpori: Gunakan ember bekas cat 20 liter yang dilubangi kecil di bagian dasar dan samping untuk aerasi.\n2. Keseimbangan Karbon dan Nitrogen: Campurkan bahan hijau kaya nitrogen (sisa sayuran) dan bahan cokelat kaya karbon (sekam padi, serbuk kayu, atau daun kering) dengan perbandingan 1:2.\n3. Aktivator Alami: Tambahkan sedikit tanah subur atau bioaktivator EM4 yang dilarutkan air gula merah.\n4. Pengadukan Rutin: Aduk seminggu sekali untuk menjaga pasokan oksigen.\n\nDalam waktu 4–6 minggu, kompos matang berwarna cokelat gelap kehitaman beraroma tanah hutan siap menyuburkan tanaman tanpa pupuk kimia sintetis.'
    },
    {
      id: 'audit-energi-elektronik',
      judul: 'Vampire Power: Menghentikan Kebocoran Energi Listrik Tersembunyi',
      kategori: 'Energi Terbarukan',
      kategori_slug: 'energi',
      ringkasan: 'Perangkat elektronik dalam posisi siaga (standby) tetap menyedot hingga 10% dari total tagihan listrik bulanan. Simak teknik audit mandiri peramban untuk menghemat pengeluaran.',
      waktu_baca: '3 menit',
      ikon: 'fa-solid fa-bolt',
      tanggal: '15 September 2026',
      konten_lengkap: 'Banyak dari kita mengira bahwa mematikan televisi, komputer, atau charger smartphone melalui remote atau sakelar perangkat sudah cukup. Namun pada kenyataannya, fenomena vampire draw atau phantom load tetap menyedot listrik selama steker terhubung ke stopkontak dinding.\n\n### Strategi Memotong Emisi Siaga:\n\n- Gunakan Stopkontak Bersakelar: Kelompokkan peralatan hiburan (TV, konsol, decoder) dalam satu colokan bersakelar master agar bisa dimatikan serentak dalam satu klik.\n- Cabut Pengisi Daya: Charger laptop dan HP yang dibiarkan menancap tetap mengonsumsi daya rata-rata 0,26 hingga 1,5 Watt terus-menerus.\n- Atur Mode Hemat Daya: Aktifkan pengaturan otomatis tidur (sleep mode) pada monitor setelah 5 menit tidak digunakan.\n\nDengan memutus daya siaga, sebuah rumah tangga dapat memangkas sekitar 80–120 kg emisi CO₂ setiap tahunnya tanpa mengurangi kenyamanan hidup.'
    },
    {
      id: 'konsumsi-pangan-lokal',
      judul: 'Food Miles: Mengapa Mengonsumsi Pangan Lokal Menyelamatkan Bumi',
      kategori: 'Konsumsi Bijak',
      kategori_slug: 'konsumsi',
      ringkasan: 'Setiap kilometer perjalanan bahan makanan dari kebun impor ke piring Anda meninggalkan jejak bahan bakar penerbangan dan pendinginan. Saatnya beralih ke pasar tani lokal.',
      waktu_baca: '5 menit',
      ikon: 'fa-solid fa-apple-whole',
      tanggal: '12 September 2026',
      konten_lengkap: 'Konsep food miles mengukur jarak yang ditempuh bahan makanan sebelum sampai ke tangan konsumen. Buah-buahan impor sering kali diterbangkan melintasi benua dan disimpan dalam ruang pendingin intensif energi selama berminggu-minggu.\n\n### Manfaat Pangan Lokal Nusantara:\n\n1. Pereduksian Jejak Logistik: Sayur mayur dari petani lokal di daerah sendiri hanya menempuh jarak puluhan kilometer, menghemat bahan bakar solar distribusi secara drastis.\n2. Kandungan Nutrisi Lebih Segar: Pangan yang dipanen saat matang alami di pohon tidak membutuhkan zat lilin pengawet dan perlakuan kimiawi paska-panen.\n3. Mendukung Ekonomi Petani Domestik: Perputaran uang tetap berada di komunitas lokal, memperkuat ketahanan pangan nasional.\n\nMulailah dengan gerakan \'Satu Hari Pangan Lokal\' setiap minggu dan prioritaskan sayuran musim setempat di pasar tradisional.'
    },
    {
      id: 'konservasi-air-hujan',
      judul: 'Pemanenan Air Hujan (Rainwater Harvesting) Skala Rumah Tangga',
      kategori: 'Air & Ekosistem',
      kategori_slug: 'air',
      ringkasan: 'Air hujan yang terbuang percuma ke saluran drainase dapat dipanen untuk menyiram kebun, mencuci kendaraan, dan mengurangi beban pompa air tanah berbasis listrik.',
      waktu_baca: '4 menit',
      ikon: 'fa-solid fa-droplet',
      tanggal: '10 September 2026',
      konten_lengkap: 'Krisis air bersih dan penurunan muka air tanah di kota-kota besar di Indonesia dapat diredam jika setiap rumah tangga menerapkan penampungan air hujan mandiri.\n\n### Komponen Instalasi Sederhana:\n\n- Talang Atap Bersih: Pastikan talang air atap rutin dibersihkan dari daun gugur dan debu.\n- Filter Saringan Pertama (First Flush Diverter): Buang aliran air hujan pada 10 menit pertama yang mengandung debu permukaan atap.\n- Toren Tertutup & Saringan Kasa: Tampung air pada tangki tertutup berpenyaring jaring halus guna mencegah jentik nyamuk.\n\nAir hujan memiliki pH netral dan bebas klorin, menjadikannya sangat ideal untuk kesehatan tanaman pekarangan dan menghemat pemakaian listrik pompa air hingga 30%.'
    },
    {
      id: 'bijak-plastik-sekali-pakai',
      judul: 'Panduan Praktis Transisi Hidup Bebas Plastik Sekali Pakai',
      kategori: 'Sampah & Daur Ulang',
      kategori_slug: 'sampah',
      ringkasan: 'Mikroplastik kini telah ditemukan di air minum, garam laut, bahkan udara pernapasan. Berikut lima substitusi praktis perlengkapan harian ramah lingkungan yang tahan bertahun-tahun.',
      waktu_baca: '4 menit',
      ikon: 'fa-solid fa-bag-shopping',
      tanggal: '07 September 2026',
      konten_lengkap: 'Indonesia menghasilkan sekitar 7,2 juta ton sampah plastik per tahun. Plastik konvensional membutuhkan 450 tahun untuk terurai, dan selama proses itu terpecah menjadi partikel mikroplastik berbahaya yang masuk ke rantai makanan manusia.\n\n### 5 Perlengkapan Starter Pack Zero-Waste:\n\n1. Tumbler Stainless Steel: Menggantikan rata-rata 160 botol plastik sekali pakai per orang setiap tahunnya.\n2. Tas Kain Lipat (Tote Bag): Selalu simpan di dalam tas sekolah atau kerja untuk belanja dadakan.\n3. Alat Makan Bambu / Logam: Tolak sendok dan garpu plastik saat memesan makanan bawa pulang (takeaway).\n4. Sedotan Silikon / Stainless: Hindari sedotan plastik yang sering kali berakhir melukai satwa laut.\n5. Wadah Makanan Kaca / Kotak Bekal: Bawa wadah sendiri saat membeli jajanan pasar atau makanan berkuah.'
    },
    {
      id: 'prinsip-ekologi-digital',
      judul: 'Pembersihan Data Digital: Mengurangi Jejak Emisi Internet Anda',
      kategori: 'Energi Terbarukan',
      kategori_slug: 'energi',
      ringkasan: 'Internet menyumbang sekitar 3,7% dari total emisi gas rumah kaca global. Ketahui bagaimana menghapus email sampah dan data cloud yang usang membantu menurunkan konsumsi listrik server data center.',
      waktu_baca: '3 menit',
      ikon: 'fa-solid fa-cloud',
      tanggal: '03 September 2026',
      konten_lengkap: 'Setiap email yang tersimpan di cloud membutuhkan daya listrik 24/7 di server raksasa data center untuk pendinginan dan penyimpanan cadangan. Mengirim satu email dengan lampiran berat menghasilkan sekitar 50 gram emisi CO₂ setara berkendara mobil sejauh 200 meter.\n\n### Aksi Kebersihan Digital (Digital Clean-up):\n\n- Hapus Newsletter yang Tidak Terbaca: Berhenti berlangganan (unsubscribe) email promosi yang menumpuk di kotak masuk.\n- Bersihkan Cloud Storage: Hapus video dan foto buram berkualitas ganda dari Google Drive atau iCloud.\n- Turunkan Kualitas Streaming Musik/Video: Saat hanya mendengarkan podcast, turunkan resolusi video ke 480p atau pilih audio mode hemat kuota.\n\nDigital cleaning adalah contoh nyata dari Smart Digital Solutions: menggunakan kesadaran digital untuk melindungi kelestarian fisik bumi.'
    }
  ];

  // Muat data dari JSON dengan fallback otomatis
  fetch('assets/data/edukasi.json')
    .then(response => {
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      return response.json();
    })
    .then(data => {
      allArticles = data;
      renderArticles();
    })
    .catch(() => {
      // Fallback mulus untuk file://
      allArticles = fallbackArticles;
      renderArticles();
    });

  // Filter Kategori
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentCategory = btn.getAttribute('data-category') || 'semua';
      renderArticles();
    });
  });

  // Search Real-Time
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderArticles();
    });
  }

  // Render Artikel ke DOM
  function renderArticles() {
    const filtered = allArticles.filter(article => {
      const matchCategory = currentCategory === 'semua' || article.kategori_slug === currentCategory;
      const matchSearch = article.judul.toLowerCase().includes(currentSearchQuery) ||
                          article.ringkasan.toLowerCase().includes(currentSearchQuery);
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      articlesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background-color: var(--color-neutral-stone-light); color: var(--color-neutral-soil-muted); display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px;">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 style="color: var(--color-primary-forest); margin-bottom: 8px;">Artikel Tidak Ditemukan</h3>
          <p style="color: var(--color-neutral-soil-light); font-size: 0.9rem;">Tidak ada modul edukasi yang cocok dengan kata kunci "${escapeHtml(currentSearchQuery)}". Coba kata kunci lain atau pilih kategori Semua.</p>
        </div>
      `;
      return;
    }

    articlesGrid.innerHTML = filtered.map(article => {
      let badgeClass = 'badge--sprout';
      if (article.kategori_slug === 'energi') badgeClass = 'badge--sun';
      if (article.kategori_slug === 'air') badgeClass = 'badge--sky';

      return `
        <article class="article-card artikel-card" id="card-${article.id}">
          <div class="artikel-card__isi">
            <div class="article-card__meta">
              <span class="badge ${badgeClass}">${escapeHtml(article.kategori)}</span>
              <span class="article-card__read-time">
                <i class="fa-regular fa-clock"></i>
                <span>${escapeHtml(article.waktu_baca)}</span>
              </span>
            </div>

            <h3 class="article-card__title">${escapeHtml(article.judul)}</h3>
            <p class="article-card__desc">${escapeHtml(article.ringkasan)}</p>

            <div class="article-card__footer">
              <span style="font-size: 0.75rem; color: var(--color-neutral-soil-muted);">
                <i class="fa-regular fa-calendar-days"></i> ${escapeHtml(article.tanggal)}
              </span>
              <button class="btn btn--outline btn--sm btn-read-article" data-id="${article.id}" aria-label="Baca selengkapnya artikel ${escapeHtml(article.judul)}">
                <span>Baca Modul</span>
                <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Pasang event listener tombol Baca Modul
    const readButtons = articlesGrid.querySelectorAll('.btn-read-article');
    readButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const articleId = btn.getAttribute('data-id');
        openArticleModal(articleId);
      });
    });

    // Beri tahu animasi tetesan bahwa kartu telah selesai di-render ulang
    document.dispatchEvent(new CustomEvent('articles-rendered'));
  }

  // Buka Modal Artikel
  function openArticleModal(articleId) {
    const article = allArticles.find(a => a.id === articleId);
    if (!article || !modalBackdrop || !modalContent) return;

    let badgeClass = 'badge--sprout';
    if (article.kategori_slug === 'energi') badgeClass = 'badge--sun';
    if (article.kategori_slug === 'air') badgeClass = 'badge--sky';

    // Format isi markdown sederhana ke HTML
    const formattedContent = formatArticleContent(article.konten_lengkap);

    modalContent.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="badge ${badgeClass}" style="margin-bottom: 8px;">${escapeHtml(article.kategori)}</span>
        <h2 style="font-size: clamp(1.4rem, 3vw, 1.8rem); color: var(--color-primary-forest); line-height: 1.25; margin-bottom: 8px;">
          ${escapeHtml(article.judul)}
        </h2>
        <div style="display: flex; gap: 16px; font-size: 0.8rem; color: var(--color-neutral-soil-muted);">
          <span><i class="fa-regular fa-calendar-days"></i> ${escapeHtml(article.tanggal)}</span>
          <span><i class="fa-regular fa-clock"></i> ${escapeHtml(article.waktu_baca)}</span>
        </div>
      </div>
      <hr style="margin: 16px 0; border: 0; border-top: 1px solid var(--color-neutral-stone);">
      <div class="article-body-text">
        ${formattedContent}
      </div>
    `;

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Aksesibilitas: Fokuskan tombol tutup
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  // Tutup Modal Artikel
  function closeArticleModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeArticleModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeArticleModal();
      }
    });
  }

  // Keyboard accessibility: Escape key menutup modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeArticleModal();
    }
  });

  // Helper: Format teks inline, hilangkan semua asteris markdown **, ubah sub-judul jadi strong
  function formatInlineText(str) {
    if (!str) return '';
    let safe = escapeHtml(str);
    // Ubah markdown bold **text** menjadi <strong>text</strong>
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Hilangkan semua tanda bintang liar/sisa (ai formatting residue)
    safe = safe.replace(/\*\*/g, '').replace(/\*/g, '');

    // Jika belum memiliki <strong> dan memiliki pola "Judul: Deskripsi", beri penekanan pada label
    if (!safe.includes('<strong>') && safe.includes(': ')) {
      const colonIdx = safe.indexOf(': ');
      if (colonIdx > 0 && colonIdx < 45) {
        const label = safe.slice(0, colonIdx);
        const desc = safe.slice(colonIdx + 2);
        safe = `<strong>${label}:</strong> ${desc}`;
      }
    }
    return safe;
  }

  // Parser konten modul edukasi yang bersih, terstruktur, dan bebas markdown kasar
  function formatArticleContent(text) {
    if (!text) return '';

    let lines = text.replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let currentList = null;
    let currentParagraph = [];

    function flushParagraph() {
      if (currentParagraph.length > 0) {
        let paraText = currentParagraph.join(' ').trim();
        if (paraText) {
          html += `<p style="margin-bottom: 16px; line-height: 1.7; color: var(--color-neutral-soil-light);">${formatInlineText(paraText)}</p>`;
        }
        currentParagraph = [];
      }
    }

    function flushList() {
      if (currentList) {
        html += `</${currentList}>`;
        currentList = null;
      }
    }

    lines.forEach(line => {
      let trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        flushList();
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushParagraph();
        flushList();
        const headingText = trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '').trim();
        html += `<h3 style="color: var(--color-primary-forest); font-size: 1.15rem; font-weight: 700; margin: 24px 0 12px; line-height: 1.4;">${escapeHtml(headingText)}</h3>`;
        return;
      }

      if (/^\d+\.\s/.test(trimmed)) {
        flushParagraph();
        if (currentList !== 'ol') {
          flushList();
          html += `<ol style="padding-left: 20px; margin-bottom: 16px; list-style: decimal; color: var(--color-neutral-soil-light);">`;
          currentList = 'ol';
        }
        let cleanItem = trimmed.replace(/^\d+\.\s*/, '').trim();
        html += `<li style="margin-bottom: 10px; line-height: 1.65;">${formatInlineText(cleanItem)}</li>`;
        return;
      }

      if (/^[-*]\s/.test(trimmed)) {
        flushParagraph();
        if (currentList !== 'ul') {
          flushList();
          html += `<ul style="padding-left: 20px; margin-bottom: 16px; list-style: disc; color: var(--color-neutral-soil-light);">`;
          currentList = 'ul';
        }
        let cleanItem = trimmed.replace(/^[-*]\s*/, '').trim();
        html += `<li style="margin-bottom: 10px; line-height: 1.65;">${formatInlineText(cleanItem)}</li>`;
        return;
      }

      flushList();
      currentParagraph.push(trimmed);
    });

    flushParagraph();
    flushList();

    return html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
