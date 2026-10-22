import '@fontsource/kanit/400.css';
import '@fontsource/kanit/600.css';
import '@fontsource/kanit/900.css';
import '@fontsource/lilita-one/400.css';
import '@fontsource/mitr/700.css';
import './style.css';
import { generateLaughter, parseLength } from './rng';

function element<T extends HTMLElement>(id: string): T {
  const target = document.getElementById(id);
  if (!target) throw new Error(`Missing element: ${id}`);
  return target as T;
}

const form = element<HTMLFormElement>('generator');
const lengthInput = element<HTMLInputElement>('length');
const output = element<HTMLDivElement>('output');
const count = element('digit-count');
const fives = element('five-count');
const error = element('length-error');
const status = element('status');
const reroll = element<HTMLButtonElement>('reroll');
const copy = element<HTMLButtonElement>('copy');
let current = '';
let revision = 0;
let inputTimer: ReturnType<typeof setTimeout> | undefined;
let copyTimer: ReturnType<typeof setTimeout> | undefined;

function validate(): number | null {
  const length = parseLength(lengthInput.value);
  const valid = length !== null;
  lengthInput.setAttribute('aria-invalid', String(!valid));
  error.hidden = valid;
  error.textContent = valid ? '' : 'ใส่จำนวนเต็ม 1–10,000 หลัก แล้วขำต่อได้เลย';
  reroll.disabled = !valid;
  return length;
}

function resetCopy(): void {
  clearTimeout(copyTimer);
  copy.textContent = 'คัดลอก';
  copy.disabled = !current;
}

function generate(animate = true): void {
  clearTimeout(inputTimer);
  const length = validate();
  if (length === null) return;
  revision++;
  resetCopy();
  try {
    const next = generateLaughter(length);
    current = next;
    const pieces: HTMLSpanElement[] = [];
    for (let offset = 0; offset < next.length; offset += 5) {
      const piece = document.createElement('span');
      piece.className = 'output-piece';
      piece.textContent = next.slice(offset, offset + 5);
      pieces.push(piece);
    }
    output.replaceChildren(...pieces);
    output.scrollTop = 0;
    count.textContent = next.length.toLocaleString('th-TH');
    const fiveCount = [...next].filter(digit => digit === '5').length;
    fives.textContent = fiveCount.toLocaleString('th-TH');
    status.dataset.silent = 'true';
    status.textContent = `สุ่มแล้ว ${next.length.toLocaleString('th-TH')} หลัก มีเลข 5 ${fiveCount} ตัว`;
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      output.getAnimations().forEach(animation => animation.cancel());
      output.animate([
        { transform: 'rotate(-2deg) translateY(0)' },
        { transform: 'rotate(-1deg) translateY(-3px)', offset: 0.35 },
        { transform: 'rotate(-2deg) translateY(0)' },
      ], { duration: 180, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
  } catch {
    current = '';
    output.textContent = '';
    count.textContent = '0';
    fives.textContent = '0';
    delete status.dataset.silent;
    status.textContent = 'สุ่มอย่างปลอดภัยไม่ได้ ลองขำใหม่อีกที หรือเปิดด้วยเบราว์เซอร์ที่รองรับ Web Crypto';
  }
  resetCopy();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  generate();
});
lengthInput.addEventListener('input', () => {
  clearTimeout(inputTimer);
  const length = validate();
  status.dataset.silent = 'true';
  status.textContent = length === null ? 'ผลลัพธ์เดิมยังอยู่ แก้ความยาวเพื่อสุ่มใหม่' : 'กำลังสุ่มตามความยาวใหม่';
  if (length !== null) inputTimer = setTimeout(() => generate(), 100);
});

copy.addEventListener('click', async () => {
  if (!current) return;
  const snapshot = current;
  const copiedRevision = revision;
  copy.disabled = true;
  delete status.dataset.silent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(snapshot);
    if (revision !== copiedRevision) return;
    copy.textContent = 'คัดลอกแล้ว!';
    status.textContent = `คัดลอกเสียงขำ ${snapshot.length.toLocaleString('th-TH')} หลักแล้ว ส่งต่อได้เลย`;
    copyTimer = setTimeout(resetCopy, 2000);
  } catch {
    if (revision !== copiedRevision) return;
    output.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(output);
    selection?.removeAllRanges();
    selection?.addRange(range);
    status.textContent = 'คัดลอกอัตโนมัติไม่ได้ เลือกตัวเลขไว้ให้แล้ว กดคัดลอกจากเมนูของเครื่อง หรือ Ctrl+C / ⌘C';
  } finally {
    if (revision === copiedRevision) copy.disabled = !current;
  }
});

generate(false);
