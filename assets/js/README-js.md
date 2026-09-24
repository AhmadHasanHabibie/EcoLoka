# Dokumentasi & Status Modul JavaScript — EcoLoka
**Proyek Lomba Web Design INVENTION 2026**
**Arsitektur:** 100% Client-Side Static Website (Vanilla JS & HTML5 Web APIs)

---

## 1. Modul Global & Utilitas Bersama

### A. Skrip Global (`assets/js/main.js`)
- **`initStickyHeader()`**: Mengelola elevasi shadow dan efek glassmorphism header saat scroll dengan throttled `requestAnimationFrame`.
- **`initMobileNavigation()`**: Drawer navigasi mobile lengkap dengan dukungan aksesibilitas WCAG (atribut `aria-expanded`, tombol Escape, klik overlay, dan penonaktifan scroll latar).
- **`initSmoothScroll()`**: Navigasi anchor link internal yang mulus dengan perhitungan offset tinggi sticky header otomatis.
- **`initDynamicYear()`**: Pembaruan otomatis tahun hak cipta pada footer.
- **`initScrollspy()`**: Sinkronisasi penanda menu navigasi aktif (`.is-active`) berbasis `IntersectionObserver`.
- **`initModalSertifikat()`**: Generator modal sertifikat komitmen hijau print-ready dengan nama dinamis dan stempel resmi.
- **`initEarthCounterEasterEgg()`**: Easter egg interaktif di footer yang mensimulasikan akumulasi pejuang iklim via `localStorage`.

### B. Utilitas Scroll-Linked (`assets/js/scroll-utils.js`)
- **`ScrollUtils.calculateViewportProgress(element, targetFraction)`**: Perhitungan progress posisi vertikal elemen terhadap viewport (rentang 0.0 s.d. 1.0).
- **`ScrollUtils.lerp(start, end, t)`**: Interpolasi linear matematika presisi.
- **`ScrollUtils.easeOutCubic(t)`**: Easing kurva kubik untuk transisi alami dan responsif.
- **`ScrollUtils.easeOutBackSubtle(t)`**: Easing kurva overshoot halus (`c1 = 0.5`) yang memberi efek pendaratan hidup (settle) seperti kertas melayang tanpa pantulan kasar.
- **`ScrollUtils.bindScrollProgress(element, callback)`**: Listener scroll berbasis `IntersectionObserver` (+ buffer 300px) dan throttled `requestAnimationFrame` untuk efisiensi CPU/baterai.
- **`ScrollUtils.bindScrollDelta(element, callback)`**: Listener reaktif terhadap *delta* scroll vertikal (`deltaY`). Hanya aktif saat elemen berada di dalam viewport (+ buffer 200px), ideal untuk efek berbasis arah scroll tanpa pergerakan otomatis/autoplay.

---

## 2. Modul Fitur Unggulan Halaman

### A. Modul Animasi Data-Driven "Nafas Karbon" (`assets/js/nafas-karbon.js`)
- **Diterapkan pada:** `aksi-hijau.html` (seluruh kartu pilihan kalkulator: Transportasi, Energi Rumah, Konsumsi & Sampah).
- **Mekanisme:** Mengkalkulasi durasi denyut ambient breathing berbanding lurus dengan bobot emisi kartu, memunculkan partikel asap halus atau tunas bergoyang, dan memancarkan ripple melingkar saat dipilih.

### B. Modul Marquee Horizontal Infinite Sinkron Scroll & Drag Manual (`assets/js/marquee-indikator.js`)
- **Diterapkan pada:** `pemantauan.html` (grid 4 kartu indikator keberlanjutan: Kualitas Udara, Sampah Plastik, Pohon Virtual, kWh Listrik).
- **Mekanisme:**
  - Mentransformasikan grid kartu statis menjadi track horizontal dinamis.
  - Scroll ke bawah $\rightarrow$ kartu bergeser ke **kanan**.
  - Scroll ke atas $\rightarrow$ kartu bergeser ke **kiri**.
  - Scroll berhenti $\rightarrow$ kartu **langsung diam seketika** (zero autoplay / tanpa interval timer).
  - **Interaksi Drag Manual (Mouse & Touch):** Saat scroll berhenti, pengguna dapat menggeser (drag/swipe) kartu secara manual menggunakan mouse (klik-tahan-geser) atau jari (touch).
  - **Transisi Mulus (Seamless Handoff):** Logika scroll dan drag berbagi satu variabel `posisi` dan fungsi `terapkanWrapDanTransform()` yang sama; saat drag dilepas dan halaman di-scroll kembali, pergerakan melanjutkan secara mulus dari posisi terakhir tanpa lompatan/reset.
  - Infinite loop dicapai melalui 3 set kartu identik dengan pergeseran modul tepat satu lebar set (`lebarSatuSet`).
  - Duplikat diberi atribut `aria-hidden="true"` dan `tabindex="-1"` untuk integritas semantik dan pembaca layar (screen reader).
  - Fallback otomatis ke grid statis jika JavaScript nonaktif atau pengguna memilih `@media (prefers-reduced-motion: reduce)`.

### C. Modul Kalkulator Jejak Karbon (`assets/js/kalkulator.js`)
- **Diterapkan pada:** `aksi-hijau.html`.
- **Fitur:** Mesin penghitung multi-step berstandar ESDM/IPCC, visualisasi SVG single-arc gauge dengan gradient multi-stop tanpa sambungan patah, penyimpanan `localStorage`, dan pemicu cetak sertifikat.

### D. Modul Dashboard Pemantauan (`assets/js/pemantauan.js`)
- **Diterapkan pada:** `pemantauan.html`.
- **Fitur:** Pembacaan data riwayat emisi pengguna dari `localStorage`, SVG bar comparison chart personal vs rata-rata nasional, dan penanganan status kosong (empty state) informatif.

### E. Modul Edukasi Keberlanjutan (`assets/js/edukasi.js`)
- **Diterapkan pada:** `edukasi.html`.
- **Fitur:** Dynamic article fetching dari dataset JSON lokal dengan inline fallback, pencarian real-time, filter kategori dinamis, dan modal pembaca artikel ramah aksesibilitas.

### F. Modul Kontak & FAQ (`assets/js/kontak.js`)
- **Diterapkan pada:** `kontak.html`.
- **Fitur:** Accordion FAQ interaktif berstandar aksesibilitas WCAG (keyboard navigation & ARIA state).

### G. Modul Animasi Hutan Tumbuh Kampanye Komunitas (`assets/js/animasi-kampanye-komunitas.js`)
- **Diterapkan pada:** `komunitas.html` (kartu kampanye di section "Kampanye & Kegiatan yang Sedang Berjalan").
- **Fitur:**
  - Entrance animation kartu (fade + slide masuk) terkoordinasi dengan animasi "hutan tumbuh" murni CSS di bagian bawah kartu.
  - Perhitungan progress independen per-kartu menggunakan `ScrollUtils.bindScrollProgress(kartu, updateKartu, 0.5)` — menjamin kartu selesai beranimasi tepat saat kartu berada di tengah viewport (mencegah bug "menggantung").
  - Menghormati preferensi `@media (prefers-reduced-motion: reduce)` dan graceful degradation saat JavaScript nonaktif.

### H. Modul Animasi Kartu Kontak Terbang Konvergen (`assets/js/animasi-kartu-terbang-kontak.js`)
- **Diterapkan pada:** `kontak.html` (4 kartu info kontak: Email, WhatsApp, Instagram, Basis Operasional).
- **Fitur:**
  - Efek konvergensi 4 arah: Email terbang dari kiri-atas, WhatsApp dari kanan-atas, Instagram dari kiri-bawah, dan Basis Operasional dari kanan-bawah.
  - Mengkombinasikan translasi `easeOutCubic` dan rotasi `easeOutBackSubtle` (overshoot halus `c1 = 0.5`) yang memberi efek mendarat dan mengendap alami seperti kertas melayang.
  - Progress dihitung secara mandiri per-kartu dengan `ScrollUtils.bindScrollProgress(kartu, updateKartu, 0.5)` sehingga mendarat sejajar sempurna tepat saat kartu di tengah viewport.
  - Graceful degradation: tanpa JS atau pada `@media (prefers-reduced-motion: reduce)`, keempat kartu tampil statis, rapi, dan fungsional penuh di posisi grid normalnya.

### I. Modul Animasi Gelombang Font Variable (`assets/js/gelombang-font.js`)
- **Diterapkan pada:** `tentang.html` (heading "Mengapa Solusi Digital untuk Kelestarian Lingkungan?").
- **Fitur:**
  - Memanfaatkan variable font Google Fonts **Sora** (`wght@100..800`) untuk menghasilkan "gelombang ketebalan" yang menyapu melintasi teks saat scroll.
  - Pemecahan karakter dinamis via JavaScript dengan struktur aksesibilitas ketat (`role="text"` + `aria-label` kalimat utuh, `aria-hidden="true"` pada setiap span karakter) sehingga pembaca layar membaca teks secara utuh dan sempurna.
  - Penguncian lebar karakter berbasis `document.fonts.ready` guna mencegah layout shift / getaran teks.

### J. Modul Animasi Jejak Sirkuit Cahaya Kartu (`assets/js/jejak-sirkuit-kartu.js`)
- **Diterapkan pada:** `tentang.html` (3 kartu prinsip solusi digital).
- **Fitur:**
  - Animasi menggambar border kartu secara presisi melalui SVG `rect` stroke-dashoffset geometry (`getTotalLength()`).
  - Titik node cahaya amber (`.prinsip-card__node`) melintas mengelilingi border teraktivasi menggunakan koordinat `getPointAtLength()` dengan opacity sinusoidal halus.
  - Isi kartu memudar masuk secara terkoordinasi (tumpang tindih natural dengan penarikan border).
  - Progress independen per-kartu via `ScrollUtils.bindScrollProgress(kartu, updateKartu, 0.5)`.

---

## 3. Kepatuhan Ketat Aturan Lomba
- Semua modul di atas dirancang **100% Client-Side** murni Vanilla JavaScript (ES6+).
- **Bebas Framework:** Tanpa React, Vue, Angular, Svelte, atau runtime server (Node/PHP).
- **Bebas Library Animasi Eksternal:** Tanpa GSAP, ScrollTrigger, AOS, dsb.
- Kode ditulis modular, `'use strict'`, rapi, dan terdokumentasi penuh.
