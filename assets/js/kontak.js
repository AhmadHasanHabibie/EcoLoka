/**
 * ==========================================================================
 * ECOLOKA — FAQ ACCORDION (kontak.js)
 * Proyek: Website Lomba Web Design INVENTION 2026 — Universitas Udayana
 * Subtema: "Going Green Through Smart Digital Solutions"
 * Fitur: Accordion FAQ interaktif dengan aria-expanded ramah aksesibilitas WCAG
 * Arsitektur: 100% Client-Side Static Website
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
});

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
