/**
 * nafas-karbon.js
 * Setiap kartu pilihan kalkulator "bernapas" sesuai bobot emisinya sendiri
 * (data-driven animation): napas ambient, partikel tunas/asap, dan riak
 * saat dipilih. Intensitas dinormalisasi PER STEP (bukan angka global),
 * agar tetap proporsional meski rentang nilai tiap step berbeda.
 *
 * PENTING: fungsi initNafasKarbon(container) HARUS dipanggil ulang oleh
 * logika kalkulator yang sudah ada setiap kali sebuah step baru dirender
 * ke layar (misalnya saat pengguna pindah dari step 1 ke step 2), karena
 * kartu-kartu di step baru adalah elemen DOM baru yang perlu diinisialisasi.
 */

(function () {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function buatTunas() {
    const wrapper = document.createElement('div');
    wrapper.className = 'tunas';
    wrapper.innerHTML = `
      <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
        <path d="M8 28V10" stroke="var(--color-primary-leaf)" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 12C8 12 2 10 2 5C2 5 8 4 8 12Z" fill="var(--color-accent-sprout)"/>
        <path d="M8 15C8 15 14 13 14 8C14 8 8 7 8 15Z" fill="var(--color-primary-leaf)"/>
      </svg>
    `;
    return wrapper;
  }

  function buatAsap(intensitas) {
    const container = document.createDocumentFragment();
    // Jumlah partikel asap proporsional dengan intensitas (1-4 partikel)
    const jumlahPartikel = Math.max(1, Math.round(intensitas * 4));
    for (let i = 0; i < jumlahPartikel; i++) {
      const partikel = document.createElement('span');
      partikel.className = 'asap';
      partikel.style.left = `${8 + i * 4}px`;
      // Kecepatan mengepul lebih cepat untuk emisi lebih tinggi
      const durasi = (typeof ScrollUtils !== 'undefined' && ScrollUtils.lerp)
        ? ScrollUtils.lerp(4.5, 2, intensitas)
        : (4.5 + (2 - 4.5) * intensitas);
      partikel.style.animationDuration = `${durasi}s`;
      partikel.style.animationDelay = `${i * 0.6}s`;
      container.appendChild(partikel);
    }
    return container;
  }

  function warnaRiak(intensitas) {
    // Interpolasi warna sederhana: hijau (rendah) -> oranye hangat (tinggi)
    return intensitas < 0.5
      ? 'var(--color-primary-leaf)'
      : 'var(--color-accent-sun)';
  }

  window.initNafasKarbon = function (container) {
    if (!container) return;

    const kartuList = Array.from(container.querySelectorAll('.opsi-kartu'));
    if (kartuList.length === 0) return;

    const nilaiEmisi = kartuList.map((k) => {
      const fromAttr = k.dataset.emisi;
      if (fromAttr !== undefined && fromAttr !== '') return parseFloat(fromAttr);
      const input = k.querySelector('input[type="radio"]');
      return input ? parseFloat(input.value) || 0 : 0;
    });

    const nilaiMin = Math.min(...nilaiEmisi);
    const nilaiMax = Math.max(...nilaiEmisi);
    const rentang = nilaiMax - nilaiMin || 1; // hindari pembagian dengan nol jika semua nilai sama

    kartuList.forEach((kartu) => {
      const rawAttr = kartu.dataset.emisi;
      const emisi = (rawAttr !== undefined && rawAttr !== '' && !isNaN(parseFloat(rawAttr)))
        ? parseFloat(rawAttr)
        : (parseFloat(kartu.querySelector('input[type="radio"]')?.value) || 0);

      const intensitas = (emisi - nilaiMin) / rentang; // 0 (paling ringan) - 1 (paling berat)

      let partikelWadah = kartu.querySelector('.opsi-kartu__partikel');
      if (!partikelWadah) {
        partikelWadah = document.createElement('span');
        partikelWadah.className = 'opsi-kartu__partikel';
        partikelWadah.setAttribute('aria-hidden', 'true');
        kartu.appendChild(partikelWadah);
      }

      if (prefersReducedMotion) {
        // Tampilkan kartu tanpa animasi loop apapun, cukup normal
        if (partikelWadah) partikelWadah.innerHTML = '';
      } else {
        // Durasi napas: kartu ringan berdenyut lambat (5s), kartu berat lebih cepat (2s)
        const durasiNafas = (typeof ScrollUtils !== 'undefined' && ScrollUtils.lerp)
          ? ScrollUtils.lerp(5, 2, intensitas)
          : (5 + (2 - 5) * intensitas);
        kartu.style.animationDuration = `${durasiNafas}s`;

        // Isi partikel: tunas untuk intensitas rendah, asap untuk intensitas tinggi
        if (partikelWadah) {
          partikelWadah.innerHTML = '';
          if (intensitas < 0.15) {
            partikelWadah.appendChild(buatTunas());
          } else {
            partikelWadah.appendChild(buatAsap(intensitas));
          }
        }
      }

      // Efek riak saat kartu dipilih — diasumsikan kartu sudah punya event
      // click yang menangani logika pemilihan (skoring dsb). Di sini HANYA
      // menambahkan lapisan visual, tidak menyentuh logika skoring yang ada.
      if (!kartu._nafasKarbonBound) {
        kartu._nafasKarbonBound = true;
        kartu.addEventListener('click', () => {
          if (prefersReducedMotion) return;

          // Hapus riak lama jika ada, buat elemen baru (memastikan animasi
          // selalu bisa diulang meski diklik berkali-kali secara cepat)
          const riakLama = kartu.querySelector('.opsi-kartu__riak');
          if (riakLama) riakLama.remove();

          const riak = document.createElement('div');
          riak.className = 'opsi-kartu__riak';
          riak.style.setProperty('--riak-warna', warnaRiak(intensitas));
          kartu.appendChild(riak);

          // Bersihkan elemen riak setelah animasi selesai (housekeeping DOM)
          setTimeout(() => riak.remove(), 650);
        });
      }
    });

    // Jeda animasi napas saat kartu di luar viewport, demi performa
    if ('IntersectionObserver' in window && !container._nafasObserverActive) {
      container._nafasObserverActive = true;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle('nafas-dijeda', !entry.isIntersecting);
          });
        },
        { rootMargin: '100px 0px 100px 0px' }
      );
      kartuList.forEach((kartu) => observer.observe(kartu));
    }
  };

  // Inisialisasi untuk step pertama yang sudah tampil saat halaman dimuat
  document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.multistep__panel, .kalkulator-step');
    panels.forEach((p) => {
      if (p.classList.contains('is-active')) {
        window.initNafasKarbon(p);
      }
    });
    const firstPanel = document.querySelector('.multistep__panel:first-of-type, #panel-step-1');
    if (firstPanel) window.initNafasKarbon(firstPanel);
  });
})();
