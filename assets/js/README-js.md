# Dokumentasi & Rencana Modul JavaScript — EcoLoka
**Proyek Lomba Web Design INVENTION 2026**
**Arsitektur:** 100% Client-Side Static Website (Vanilla JS & HTML5 Web APIs)

---

## 1. Modul yang Telah Diimplementasikan (Tahap 1 — Fondasi)
- **`initStickyHeader()`**: Mengelola elevasi shadow dan efek glassmorphism header saat scroll dengan throttled `requestAnimationFrame`.
- **`initMobileNavigation()`**: Drawer navigasi mobile lengkap dengan dukungan aksesibilitas WCAG (atribut `aria-expanded`, tombol Escape, klik overlay, dan pencegahan scroll latar).
- **`initSmoothScroll()`**: Navigasi anchor link internal yang mulus dengan perhitungan offset tinggi sticky header otomatis.
- **`initDynamicYear()`**: Pembaruan otomatis tahun hak cipta pada footer.
- **`initScrollspy()`**: Sinkronisasi penanda menu navigasi aktif (`.is-active`) berbasis `IntersectionObserver`.

---

## 2. Rencana Modul JavaScript Tahap 2 & Tahap 3

### A. Modul EcoCalc (`assets/js/calculator.js`) — [Tahap 2]
- **Tujuan:** Kalkulator jejak karbon interaktif berbasis browser.
- **Fitur Utama:**
  - Input interaktif: konsumsi listrik bulanan (kWh), moda transportasi harian (motor/mobil/angkot), dan pola konsumsi harian.
  - Rumus konversi standar emisi CO₂ lokal (Indonesia / ESDM / IPCC).
  - Visualisasi grafik emisi interaktif menggunakan SVG / Canvas murni tanpa library pihak ketiga.
  - Rekomendasi aksi pereduksian emisi personal.

### B. Modul EcoLearn & Filter Edukasi (`assets/js/education.js`) — [Tahap 2]
- **Tujuan:** Media pembelajaran interaktif gaya hidup hijau berkelanjutan.
- **Fitur Utama:**
  - Filter kategori edukasi dinamis (Zero Waste, Energi Bersih, Konservasi Air, Konsumsi Berkelanjutan).
  - Sistem kartu bacaan cepat (Quick Eco Tips) dengan progress bacaan client-side.
  - Kuis interaktif pengetahuan lingkungan berpenilaian instan (Quiz Engine murni Vanilla JS).

### C. Modul EcoAction & Tracker Kebiasaan (`assets/js/tracker.js`) — [Tahap 3]
- **Tujuan:** Tracker kebiasaan ramah lingkungan dengan penyimpanan data lokal.
- **Fitur Utama:**
  - Checklist aksi hijau harian (membawa tumbler, mematikan lampu saat siang, memilah sampah).
  - Penyimpanan data riwayat aksi menggunakan `localStorage` browser pengguna (tanpa server/database eksternal).
  - Perhitungan akumulasi dampak: perkiraan kilogram sampah yang dicegah & estimasi gram CO₂ yang ditekan.
  - Fitur ekspor/cetak kartu pencapaian hijau (Eco Impact Summary).

---

## 3. Kepatuhan Aturan Lomba
- Semua modul di atas dirancang **100% Client-Side**.
- **Dilarang:** Memasukkan framework JS terlarang (React, Vue, Angular, Svelte) atau Node backend.
- Kode ditulis secara modular, memiliki deklarasi `'use strict'`, serta dokumentasi komentar JSDoc yang jelas di setiap fungsi.
