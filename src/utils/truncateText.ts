// src/utils/truncateText.ts
let attempts = 0;
const MAX_ATTEMPTS = 100;
export const truncateText = (el: HTMLSpanElement, fullText: string) => {
  el.textContent = fullText;
  let text = fullText;

  while (el.scrollWidth > el.offsetWidth && text.length > 1 && attempts < MAX_ATTEMPTS) {
    const cut = Math.max(text.lastIndexOf(' '), text.lastIndexOf('-'));
    text = cut > 0 ? text.slice(0, cut) : text.slice(0, -1);
    el.textContent = text.trim() + '…';
    attempts++;
  }
};
