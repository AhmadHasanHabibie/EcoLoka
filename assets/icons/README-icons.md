# Dokumentasi Ikonografi — EcoLoka
**Proyek Lomba Web Design INVENTION 2026**

---

## 1. Pendekatan Ikonografi
Sistem antarmuka EcoLoka mengombinasikan dua metode penanganan ikon:
1. **Custom Inline SVG:** Digunakan pada elemen identitas kunci (seperti Logo Daun EcoLoka pada Navbar dan Footer) guna memastikan nol dependensi jaringan eksternal dan kontrol animasi CSS secara langsung.
2. **Font Awesome 6 Free (via cdnjs):** Digunakan untuk simbol-simbol UI umum (navigasi, indikator statistik, tombol aksi, dan media sosial) dengan pemuatan teroptimasi.

---

## 2. Rencana Ikon Custom SVG (Tahap 2 & 3)
Berkas ikon SVG kustom untuk pilar fitur khusus (misal: ikon kalkulator emisi, pohon interaktif, dan lencana aksi) dapat ditempatkan pada folder `assets/icons/` dalam format `.svg` teroptimasi (minified melalui SVGO) untuk menjaga efisiensi transfer data website.
