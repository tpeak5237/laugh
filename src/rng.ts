export const TOTAL_WEIGHT = 901;
export const ACCEPT_BELOW = Math.floor(65_536 / TOTAL_WEIGHT) * TOTAL_WEIGHT;
export const MIN_LENGTH = 1;
export const MAX_LENGTH = 10_000;
const BUFFER_WORDS = 2048; // 4 KiB, well below getRandomValues' 65,536-byte limit.

/** Test seam only. The public interface always uses the browser's Web Crypto. */
export type RandomFill = (buffer: Uint16Array) => void;

export function parseLength(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const length = Number(value);
  return Number.isSafeInteger(length) && length >= MIN_LENGTH && length <= MAX_LENGTH
    ? length
    : null;
}

/** 0–499 → 0–4; 500 → 5; 501–900 → 6–9. */
export function digitAt(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index >= TOTAL_WEIGHT) {
    throw new RangeError('Weighted index must be an integer from 0 to 900');
  }
  if (index < 500) return String(Math.floor(index / 100));
  if (index === 500) return '5';
  return String(6 + Math.floor((index - 501) / 100));
}

function secureFill(buffer: Uint16Array): void {
  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Secure randomness is unavailable');
  }
  globalThis.crypto.getRandomValues(buffer);
}

/** Each accepted 16-bit sample maps to an unbiased weighted index.
 * Rejected samples are discarded, never repaired or substituted.
 * A fresh buffer is used for every call; there is no seed or output history.
 */
export function generateLaughter(length: number, fill: RandomFill = secureFill): string {
  if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new RangeError('Length must be an integer from 1 to 10,000');
  }
  const buffer = new Uint16Array(BUFFER_WORDS);
  const digits: string[] = [];
  // Fail closed on a broken provider instead of freezing the page indefinitely.
  const refillLimit = 128 + Math.ceil(length / BUFFER_WORDS) * 4;
  let refills = 0;
  while (digits.length < length) {
    if (++refills > refillLimit) throw new Error('Secure random source did not produce usable values');
    fill(buffer);
    for (const word of buffer) {
      if (word >= ACCEPT_BELOW) continue;
      digits.push(digitAt(word % TOTAL_WEIGHT));
      if (digits.length === length) break;
    }
  }
  return digits.join('');
}
