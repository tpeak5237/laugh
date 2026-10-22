import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ACCEPT_BELOW, digitAt, generateLaughter, parseLength } from '../src/rng';
import type { RandomFill } from '../src/rng';

const fillWith = (word: number): RandomFill => buffer => { buffer.fill(word); };

test('exact 901-index weighted mapping, including every boundary', () => {
  const histogram = Array<number>(10).fill(0);
  for (let index = 0; index < 901; index++) histogram[Number(digitAt(index))]!++;
  assert.deepEqual(histogram, [100,100,100,100,100,1,100,100,100,100]);
  for (const [index, digit] of [[0,'0'],[99,'0'],[100,'1'],[499,'4'],[500,'5'],[501,'6'],[600,'6'],[601,'7'],[800,'8'],[801,'9'],[900,'9']] as const) {
    assert.equal(digitAt(index), digit);
  }
});
test('rejects invalid weighted indices', () => {
  for (const index of [-1,901,1.5,NaN,Infinity]) assert.throws(() => digitAt(index), RangeError);
});
test('acceptance threshold gives each weighted index exactly 72 preimages', () => {
  assert.equal(ACCEPT_BELOW, 64_872);
  const histogram = Array<number>(901).fill(0);
  for (let word = 0; word < ACCEPT_BELOW; word++) histogram[word % 901]!++;
  assert.ok(histogram.every(count => count === 72));
  assert.equal(65_536 - ACCEPT_BELOW, 664);
});
test('rejects threshold and 65535, accepts threshold - 1 and zero', () => {
  let calls = 0;
  const result = generateLaughter(2, buffer => {
    calls++;
    buffer.fill(65_535);
    buffer[0] = ACCEPT_BELOW;
    buffer[1] = ACCEPT_BELOW - 1;
    buffer[2] = 0;
  });
  assert.equal(result, '90');
  assert.equal(calls, 1);
});
test('refills after a completely rejected buffer and does not patch in digits', () => {
  let calls = 0;
  assert.equal(generateLaughter(3, buffer => {
    buffer.fill(++calls === 1 ? 65_535 : 500);
  }), '555');
  assert.equal(calls, 2);
});
test('fails closed on endlessly rejected values rather than hanging', () => {
  assert.throws(() => generateLaughter(1, fillWith(65_535)), /usable values/);
});
test('supports lengths 1 and 10000, uses bounded crypto buffers', () => {
  for (const length of [1,2,50,2048,2049,10_000]) {
    let calls = 0;
    const result = generateLaughter(length, buffer => {
      assert.ok(buffer.byteLength <= 65_536);
      calls++;
      buffer.fill(800);
    });
    assert.equal(result.length, length);
    assert.match(result, /^8+$/);
    assert.equal(calls, Math.ceil(length / 2048));
  }
});
test('deterministic distribution sanity: ten complete cycles reproduce exact weights', () => {
  let cursor = 0;
  const result = generateLaughter(9010, buffer => {
    for (let i = 0; i < buffer.length; i++) buffer[i] = cursor++ % 901;
  });
  const counts = [...result].reduce((acc, digit) => {
    acc[Number(digit)]!++; return acc;
  }, Array<number>(10).fill(0));
  assert.deepEqual(counts, [1000,1000,1000,1000,1000,10,1000,1000,1000,1000]);
});
test('preserves all sampled 5s and permits zero-five output', () => {
  assert.equal(generateLaughter(50, fillWith(500)), '5'.repeat(50));
  assert.equal(generateLaughter(50, fillWith(499)), '4'.repeat(50));
});
test('new calls use fresh samples and have no dependence on previous output', () => {
  let value = 0;
  const source: RandomFill = buffer => { buffer.fill(value); };
  assert.equal(generateLaughter(4, source), '0000');
  value = 900;
  assert.equal(generateLaughter(4, source), '9999');
  value = 0;
  assert.equal(generateLaughter(4, source), '0000');
});
test('rejects invalid lengths and parses only supported integer input', () => {
  for (const n of [0,-1,10_001,1.1,NaN,Infinity]) assert.throws(() => generateLaughter(n), RangeError);
  for (const text of ['', ' ', '0', '-1','10001','1.2','1e2','0x10','Infinity','50x']) assert.equal(parseLength(text),null);
  assert.equal(parseLength('1'),1);
  assert.equal(parseLength('10000'),10000);
  assert.equal(parseLength('0050'),50);
});
test('secure provider errors propagate without a fallback', () => {
  assert.throws(() => generateLaughter(1, () => { throw new Error('crypto failure'); }), /crypto failure/);
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto')!;
  try {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
    assert.throws(() => generateLaughter(1), /Secure randomness is unavailable/);
  } finally { Object.defineProperty(globalThis, 'crypto', descriptor); }
});
test('production source contains no Math.random fallback, seeded PRNG or fixed output', () => {
  assert.doesNotMatch(readFileSync(new URL('../src/rng.ts', import.meta.url), 'utf8'), /Math\.random|seedrandom|mulberry|xorshift/);
  const original = Math.random;
  try {
    Math.random = () => { throw new Error('insecure random source used'); };
    assert.match(generateLaughter(10_000), /^[0-9]{10000}$/);
  } finally { Math.random = original; }
});
