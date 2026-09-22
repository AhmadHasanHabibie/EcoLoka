/**
 * ==========================================================================
 * ECOLOKA — FORM KONTAK & FAQ ACCORDION (kontak.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Fitur: Validasi Form Inline Ramah WCAG, Accordion FAQ dengan aria-expanded
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const successBox = document.getElementById('contact-success-alert');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    // Validasi Nama
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      showError('contact-name', 'Nama lengkap wajib diisi minimal 3 karakter.');
      isValid = false;
    } else {
      clearError('contact-name');
    }

    // Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError('contact-email', 'Harap masukkan format alamat email yang valid.');
      isValid = false;
    } else {
      clearError('contact-email');
    }

    // Validasi Subjek
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 4) {
      showError('contact-subject', 'Subjek pesan minimal 4 karakter.');
      isValid = false;
    } else {
      clearError('contact-subject');
    }

    // Validasi Pesan
    if (!messageInput.value.trim() || messageInput.value.trim().length < 15) {
      showError('contact-message', 'Pesan Anda terlalu singkat (minimal 15 karakter).');
      isValid = false;
    } else {
      clearError('contact-message');
    }

    if (isValid) {
      contactForm.reset();
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  function showError(id, msg) {
    const group = document.getElementById(id)?.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errEl = group.querySelector('.form-feedback--error');
      if (errEl) errEl.textContent = msg;
    }
  }

  function clearError(id) {
    const group = document.getElementById(id)?.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }
}

function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Tutup item accordion lainnya untuk kenyamanan membaca
      accordionItems.forEach(other => {
        other.classList.remove('is-open');
        const otherTrigger = other.querySelector('.accordion__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}
