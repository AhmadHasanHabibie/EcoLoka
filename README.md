# EcoLoka — Smart Digital Solutions for Going Green
> **Karya Lomba Web Design INVENTION 2026**  
> Program Studi Informatika, Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Udayana  
> **Tema Besar:** *"Innovative Web Solutions for a Smarter Digital Society"*  
> **Subtema:** *"Going Green Through Smart Digital Solutions"*  
> **Tingkat:** SMA / SMK / Sederajat  

---

## 1. Tentang EcoLoka

**EcoLoka** (berasal dari kata *"Eco"* yang merepresentasikan ekologi dan *"Loka"* dari bahasa Sanskerta/Jawa Kuno yang bermakna dunia, tempat, atau ranah) adalah platform web edukasi dan aksi lingkungan digital terpadu. EcoLoka dirancang untuk menjembatani kesadaran ekologis generasi muda dengan tindakan nyata sehari-hari melalui antarmuka cerdas, ringan, dan mandiri.

Website ini berfokus pada tiga pilar utama:
1. **EcoLearn:** Media edukasi interaktif tentang keberlanjutan, pengelolaan sampah, efisiensi energi, dan konservasi air.
2. **EcoCalc:** Kalkulator jejak karbon pribadi multi-step yang beroperasi secara instan di peramban (client-side) lengkap dengan visualisasi SVG gauge meter.
3. **EcoAction & EcoTracker:** Pemantau kebiasaan ramah lingkungan, dashboard metrik komparasi personal vs standar nasional, serta jejaring aksi relawan komunitas.

---

## 2. Kepatuhan Ketat Aturan Lomba (Radical Compliance)

Karya ini dibangun dengan menjunjung tinggi integritas teknis dan kepatuhan mutlak terhadap seluruh regulasi INVENTION 2026:

| Regulasi Lomba | Implementasi pada EcoLoka | Status |
|---|---|---|
| **Website Statis Murni** | Tidak ada database dan tidak ada server backend (tanpa PHP, Node.js, Python, Ruby, dsb). Seluruh komputasi berjalan 100% di browser klien. | ✅ Terpenuhi |
| **Batas Framework JS** | Dilarang menggunakan React, Vue, Angular, Svelte, dsb. EcoLoka dibangun 100% menggunakan **Vanilla JavaScript modern (ES6+)**. | ✅ Terpenuhi |
| **Framework / Metodologi CSS** | Dibangun dari nol menggunakan **CSS Modular berstandar BEM** dengan cascading architecture (`variables` → `base` → `layout` → `components` → `utilities`). Font Awesome 6 & Google Fonts dimuat via CDN resmi. | ✅ Terpenuhi |
| **Orisinalitas Desain & Bebas Template** | 100% dibuat dari nol (scratch), tanpa menggunakan template siap pakai (Bootstrap starter, HTML5UP, ThemeForest, Tailwind UI, dsb). | ✅ Terpenuhi |
| **Batas Halaman** | Tepat 7 halaman konten inti + 1 halaman error (`404.html`) terstruktur rapi. | ✅ Terpenuhi |
| **Bebas Pelanggaran Hak Cipta (Zero Copyright Infringement)** | Seluruh 4 aset visual foto/ilustrasi beresolusi tinggi diciptakan secara orisinal khusus untuk karya ini, tanpa watermark dan bebas royalti komersial pihak ketiga. | ✅ Terpenuhi |
| **Bahasa Pengantar** | Bahasa Indonesia formal, edukatif, dan komunikatif sebagai bahasa utama narasi. | ✅ Terpenuhi |
| **Integritas Konten** | Bebas dari unsur SARA, pornografi, ujaran kebencian, dan promosi komersial pihak ketiga. | ✅ Terpenuhi |
| **Aksesibilitas & Keterbacaan (WCAG AA)** | Kontras warna teks minimal 4.5:1, skip-to-content link, keyboard navigable (Tab & Escape trapping), semantic HTML5, serta kepatuhan `@media (prefers-reduced-motion: reduce)`. | ✅ Terpenuhi |
| **Clean Code & Green Web Performance** | Indentasi konsisten 2 spasi, pemanfaatan caching peramban, lazy loading gambar native, zero layout shift (CLS = 0), dan pemisahan fungsi modular. | ✅ Terpenuhi |

---

## 3. Filosofi Desain & Sistem Warna

Desain visual EcoLoka mengusung prinsip **"Form Follows Meaning"** dan **"Coherence Over Decoration"**. Setiap pilihan warna memiliki makna filosofis yang terdokumentasi:

```css
/* Palet Warna Filosofis EcoLoka */
--color-primary-forest: #1B4332; /* Hijau hutan tua — akar, keteguhan, bumi yang dijaga */
--color-primary-leaf:   #2D6A4F; /* Hijau daun — pertumbuhan, keberlanjutan, aksi nyata */
--color-accent-sprout:  #74C69D; /* Hijau tunas muda — harapan, inovasi digital generasi baru */
--color-accent-sun:     #F4A259; /* Kuning-oranye surya — energi terbarukan, kehangatan manusia */
--color-accent-sky:     #A8DADC; /* Biru langit pucat — udara bersih, kejernihan teknologi */
--color-neutral-soil:   #2B2D2F; /* Abu gelap tanah — kestabilan dan teks utama kontras tinggi */
--color-neutral-mist:   #F7F9F7; /* Putih kehijauan pucat — kanvas bernapas anti-pemborosan */
--color-neutral-stone:  #DDE5DD; /* Abu-hijau muda — pembatas dan garis batas tenang */
--color-alert-warning:  #E76F51; /* Oranye kemerahan — urgensi krisis iklim (terbatas) */
```

### Aturan Proporsi Warna (60-30-10 Rule):
- **60% (Latar & Kanvas):** `--color-neutral-mist` menciptakan ruang lapang yang bersih, merefleksikan nilai anti-pemborosan sumber daya visual.
- **30% (Struktur & Hirarki):** Gradasi hijau (`forest`, `leaf`, `sprout`) membingkai struktur, header, footer, dan kartu konten.
- **10% (Aksen & CTA):** Warna aksen surya (`sun`) dan tunas (`sprout`) difokuskan pada titik perhatian penting (tombol aksi, status keberhasilan, dan badge data).

### Tipografi & Skala Modular (Grid 8px):
- **Heading/Display Font:** `Plus Jakarta Sans` (karya desainer Indonesia, mencerminkan identitas modern, tegas, dan ramah).
- **Body Font:** `Inter` (sans-serif netral dengan keterbacaan tinggi di berbagai resolusi layar).
- **Rasio Modular:** Major Third (1.25x) untuk hirarki visual yang harmonis.
- **Grid Spacing 8px:** Seluruh margin dan padding merupakan kelipatan 8px (8, 16, 24, 32, 48, 64, 96, 128) untuk ketertiban visual.

---

## 4. Peta Situs Final (7 Halaman Inti + 1 Halaman Kesalahan)

EcoLoka dirancang dengan arsitektur informasi terstruktur yang saling terhubung secara harmonis:

| # | Halaman | Berkas | Peran & Fitur Unggulan |
|---|---|---|---|
| 1 | **Beranda** | `index.html` | Pintu gerbang platform, media frame visual alam & sirkuit data digital, statistik urgensi krisis iklim nasional, teaser 3 pilar solusi, dan call-to-action interaktif. |
| 2 | **Tentang** | `tentang.html` | Latar belakang 3 isu kritis, Visi & Misi, filosofi *"Mengapa Solusi Digital?"*, visual restorasi mangrove pesisir orisinal, dan profil tim pengembang. |
| 3 | **Edukasi** | `edukasi.html` | Pusat literasi modul keberlanjutan dinamis (JSON fetch + fallback), filter 4 kategori, pencarian real-time, dan modal bacaan artikel aksesibel. |
| 4 | **Aksi Hijau** | `aksi-hijau.html` | **Fitur Unggulan:** Kalkulator jejak karbon multi-step, SVG gauge meter interaktif, rekomendasi personal, penyimpanan LocalStorage, dan akses langsung ke **Sertifikat Komitmen Hijau**. |
| 5 | **Pemantauan** | `pemantauan.html` | Dashboard riwayat emisi pengguna (sinkronisasi LocalStorage), visualisasi grafik batang komparasi SVG vs standar nasional, empty state interaktif, indikator lingkungan simulatif, dan opsi cetak sertifikat. |
| 6 | **Komunitas** | `komunitas.html` | Visualisasi gotong royong pemuda orisinal, galeri kampanye aksi hijau lokal & nasional, target progress bar bulanan, dan formulir pendaftaran relawan client-side. |
| 7 | **Kontak** | `kontak.html` | Formulir pesan dengan validasi inline ramah WCAG, informasi sekretariat, dan FAQ accordion interaktif. |
| 8 | **Halaman 404** | `404.html` | **Sentuhan Artistik:** "Tersesat di Hutan Digital" dengan ilustrasi hutan kunang-kunang orisinal, tombol pemandu jalan pulang, dan tautan langsung ke halaman utama. |

---

## 5. Fitur Mahakarya (Signature Features)

### A. Sertifikat Digital Komitmen Aksi Hijau (Print-Ready Personal Certificate)
- Dapat diakses dari halaman **Aksi Hijau** (setelah menghitung emisi) atau dari **Dashboard Pemantauan**.
- **Real-time Name Customization:** Pengguna dapat mengetikkan nama lengkap mereka langsung di dalam modal dan melihat sertifikat terbarui secara instan.
- **Kepatuhan `@media print` Penuh:** Saat tombol *"Cetak / Unduh PDF"* ditekan, CSS print secara otomatis menyembunyikan seluruh elemen navigasi, footer, dan kontrol modal, mengisolasi dokumen sertifikat berbingkai ganda resmi A4 dengan stempel digital dan nomor seri unik (`ECOLOKA-INV26-XXXX`).

### B. Motion System Berstandar 60fps & Aksesibilitas Sensorik
- Menggunakan `IntersectionObserver` ringan dengan pembersihan observer satu kali (`unobserve()`) untuk mencegah memory leak.
- Animasi hanya menggunakan properti `opacity` dan `transform: translateY()` dengan `will-change` hints, menjamin rendering 60fps bebas jank.
- **Dukungan `@media (prefers-reduced-motion: reduce)`:** Bagi pengguna yang sensitif terhadap gerakan atau mengaktifkan mode hemat daya sistem, seluruh efek scroll dan transisi dinonaktifkan secara otomatis tanpa mengurangi fungsi.

### C. Easter Egg: Penghitung Pejuang Bumi & Mode Rendah Emisi
- Tersemat di footer seluruh halaman sebagai elemen penghargaan interaktif bagi pengunjung.
- Menyimpan benih kunjungan di `localStorage` peramban untuk mensimulasikan penghitungan komunitas pejuang bumi yang terakumulasi.

---

## 6. Inventaris Aset Visual Orisinal (assets/img/)

Seluruh aset visual dibuat khusus untuk proyek EcoLoka dan didokumentasikan di `assets/img/README-assets.md`:
1. `hero_nature_tech.jpg` — Konsep tunas muda dan jalur sirkuit data digital bercahaya fajar.
2. `mangrove_conservation.jpg` — Dokumentasi restorasi bibit mangrove pesisir pantai Indonesia.
3. `community_action.jpg` — Dokumentasi pelajar dan relawan muda dalam aksi bank sampah & kebun urban.
4. `lost_digital_forest.jpg` — Ilustrasi jalan setapak hutan hujan berkabut dengan kunang-kunang digital pada halaman 404.

---

## 7. Struktur Direktori Proyek

```
Invention_TNH_2026/
├── index.html                  # 1. Beranda utama
├── tentang.html                # 2. Halaman Tentang & Misi
├── edukasi.html                # 3. Pusat Edukasi (EcoLearn)
├── aksi-hijau.html             # 4. Kalkulator Jejak Karbon (EcoCalc)
├── pemantauan.html             # 5. Dashboard Pemantauan (EcoTracker)
├── komunitas.html              # 6. Komunitas & Kampanye
├── kontak.html                 # 7. Kontak & FAQ Accordion
├── 404.html                    # 8. Halaman Kesalahan "Tersesat di Hutan Digital"
├── README.md                   # Dokumentasi resmi proyek & panduan teknis
└── assets/
    ├── css/
    │   ├── variables.css       # Definisi token desain (warna filosofis, tipografi, grid 8px, motion)
    │   ├── base.css            # CSS reset modern, pengaturan aksesibilitas & WCAG AA
    │   ├── layout.css          # Kontainer, responsive grid, sticky navbar blur, mobile drawer, footer
    │   ├── components.css      # Tombol, badges, multi-step form, SVG gauge, modal sertifikat, print styles
    │   └── utilities.css       # Helper class (spacing, text-align, display, screen-reader-only)
    ├── data/
    │   ├── edukasi.json        # Dataset artikel edukasi keberlanjutan terstruktur
    │   ├── rekomendasi.json    # Dataset rekomendasi aksi personal (rendah, sedang, tinggi)
    │   └── komunitas.json      # Dataset inisiatif dan kampanye relawan hijau
    ├── js/
    │   ├── main.js             # Skrip global: Sticky navbar, drawer, scroll reveal, sertifikat modal, easter egg
    │   ├── edukasi.js          # Modul edukasi: JSON fetch + fallback, filter, live search, accessible modal
    │   ├── kalkulator.js       # Modul kalkulator: Multi-step engine, scoring, SVG gauge, hook sertifikat
    │   ├── pemantauan.js       # Modul dashboard: LocalStorage reader, SVG bar chart, empty state, hook sertifikat
    │   ├── komunitas.js        # Modul komunitas: Render kampanye, progress bar, form validation client-side
    │   ├── kontak.js           # Modul kontak: Form validation inline, accordion FAQ aksesibel WCAG
    │   └── README-js.md        # Catatan arsitektur JavaScript modular
    ├── img/
    │   ├── hero_nature_tech.jpg       # Visual hero alam & teknologi
    │   ├── mangrove_conservation.jpg # Visual aksi konservasi mangrove
    │   ├── community_action.jpg      # Visual aksi komunitas pelajar
    │   ├── lost_digital_forest.jpg   # Visual hutan digital 404
    │   └── README-assets.md          # Dokumentasi lisensi & orisinalitas aset visual
    └── icons/
        └── README-icons.md           # Panduan integrasi ikon inline SVG & Font Awesome CDN
```

---

## 8. Asumsi & Metodologi Perhitungan Kalkulator Jejak Karbon

Perhitungan jejak emisi karbon pada modul `kalkulator.js` mengacu pada faktor emisi standar di Indonesia (Kementerian ESDM & SIPSN KLHK) serta metodologi IPCC:

1. **Transportasi Harian (Bobot Emisi Tahunan):**
   - *Jalan Kaki / Sepeda:* `0 kg CO₂e/tahun` (Bebas bahan bakar fosil).
   - *Transportasi Umum (KRL/Bus Trans):* `~350 kg CO₂e/tahun` (Faktor beban emisi per penumpang sangat rendah).
   - *Sepeda Motor Bensin:* `~750 kg CO₂e/tahun` (Faktor emisi ~0,08 kg/km, rata-rata 25 km/hari).
   - *Mobil Pribadi Bensin:* `~1.800 kg CO₂e/tahun` (Faktor emisi ~0,20 kg/km dalam kondisi macet perkotaan).
2. **Konsumsi Energi Listrik Rumah Tangga:**
   - *Sangat Hemat / Tanpa AC:* `~400 kg CO₂e/tahun` (Pencahayaan LED dasar dan ventilasi alami).
   - *Sedang (1 AC terukur 24°C–25°C):* `~850 kg CO₂e/tahun` (Konsumsi listrik terkelola).
   - *Intensif (Banyak AC & Siaga):* `~1.600 kg CO₂e/tahun` (Beban pendingin ruangan dan pemanas air tinggi).
3. **Pola Konsumsi Pangan & Sampah:**
   - *Dominan Nabati & Bawa Wadah Sendiri:* `~300 kg CO₂e/tahun` (Minim jejak metana peternakan dan sampah plastik).
   - *Campuran Rata-rata Indonesia:* `~650 kg CO₂e/tahun` (Pola makan umum).
   - *Tinggi Daging Merah & Kemasan Sekali Pakai:* `~1.200 kg CO₂e/tahun` (Jejak limbah dan emisi rantai pasok tinggi).

### Klasifikasi Tingkatan (Tier):
- **Rendah (Green Hero):** `< 1.500 kg CO₂e/tahun` — Di bawah target batas aman kenaikan suhu global 1,5°C Perjanjian Paris.
- **Sedang (Eco Learner):** `1.500 – 2.800 kg CO₂e/tahun` — Berada di sekitar rata-rata masyarakat perkotaan Indonesia (~2.300 kg CO₂e/tahun).
- **Tinggi (Carbon Alert):** `> 2.800 kg CO₂e/tahun` — Melebihi rata-rata nasional, membutuhkan intervensi gaya hidup segera.

---

## 9. Cara Menjalankan Website Secara Lokal

Karena EcoLoka adalah **static website murni tanpa server backend**, website ini dapat dijalankan dengan sangat mudah tanpa memerlukan instalasi database, PHP, maupun Node server:

### Opsi 1: Buka Langsung di Peramban (Zero Config)
1. Unduh atau clone repository ini ke komputer Anda.
2. Buka berkas `index.html` dengan cara klik dua kali atau drag-and-drop ke peramban modern mana pun (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari). Seluruh fitur tetap bekerja berkat sistem *dual-mode fallback*.

### Opsi 2: Menggunakan Local Development Server (Rekomendasi)
Jika menggunakan VS Code:
1. Buka folder proyek di VS Code.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey).
3. Klik kanan pada berkas `index.html` dan pilih **"Open with Live Server"**.
4. Website akan terbuka otomatis di alamat `http://127.0.0.1:5500`.

---

## 10. Hak Cipta, Orisinalitas & Dedikasi
Karya ini dikembangkan secara orisinal dari nol untuk diikutsertakan dalam kompetisi **INVENTION 2026** Universitas Udayana. Seluruh komponen kode, skema warna, ilustrasi visual, dan tata letak dirancang khusus untuk memajukan agenda digitalisasi ramah lingkungan di Indonesia.
