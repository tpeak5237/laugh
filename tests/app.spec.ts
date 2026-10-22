import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

const output = (page: Page) => page.getByRole('region', { name: 'เสียงขำที่สุ่มได้' });

test('anonymous initial generation, length changes, reroll, min and max with no overflow', async ({ page }) => {
  const failures: string[] = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto('/');
  await expect(output(page)).toHaveText(/^\d{50}$/);
  await expect(page.locator('#digit-count')).toHaveText('50');
  expect(await page.locator('input').count()).toBe(1);
  const before = await output(page).textContent();
  await page.getByRole('button', { name: 'ขำใหม่อีกที' }).click();
  await expect(output(page)).not.toHaveText(before!);
  await page.getByLabel('ความยาวเสียงขำ').fill('123');
  await expect(output(page)).toHaveText(/^\d{123}$/);
  await page.getByLabel('ความยาวเสียงขำ').fill('1');
  await expect(output(page)).toHaveText(/^\d$/);
  const start = Date.now();
  await page.getByLabel('ความยาวเสียงขำ').fill('10000');
  await expect(output(page)).toHaveText(/^\d{10000}$/);
  expect(Date.now() - start).toBeLessThan(3000);
  const digits = await output(page).textContent();
  await expect(page.locator('#five-count')).toHaveText(String(digits!.split('5').length - 1));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await output(page).evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'ขำใหม่อีกที' })).toBeInViewport();
  expect(failures).toEqual([]);
  expect(page.url()).not.toMatch(/auth|login|sign.in/);
});

test('invalid values preserve displayed result, expose error, recover automatically', async ({ page }) => {
  await page.goto('/');
  await expect(output(page)).toHaveText(/^\d{50}$/);
  const before = await output(page).textContent();
  for (const invalid of ['', '0', '-1','10001','1.5','1e2','abc']) {
    await page.getByLabel('ความยาวเสียงขำ').fill(invalid);
    await expect(page.getByRole('alert')).toContainText('ใส่จำนวนเต็ม');
    await expect(page.getByRole('button', { name: 'ขำใหม่อีกที' })).toBeDisabled();
    await expect(output(page)).toHaveText(before!);
  }
  await page.getByLabel('ความยาวเสียงขำ').fill('25');
  await expect(output(page)).toHaveText(/^\d{25}$/);
  await expect(page.getByRole('alert')).toBeHidden();
});

test('copy writes exactly displayed digits via Clipboard contract', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (value: string) => { (window as Window & { copied?: string }).copied = value; },
    } });
  });
  await page.goto('/');
  await expect(output(page)).toHaveText(/^\d{50}$/);
  const expected = await output(page).textContent();
  await page.getByRole('button', { name: 'คัดลอก', exact: true }).click();
  await expect(page.getByRole('button', { name: 'คัดลอกแล้ว!' })).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { copied?: string }).copied)).toBe(expected);
});

test('clipboard rejection and missing API offer manual recovery', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('permission denied'); },
    } });
  });
  await page.goto('/');
  await expect(output(page)).toHaveText(/^\d{50}$/);
  await page.getByRole('button', { name: 'คัดลอก', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('คัดลอกอัตโนมัติไม่ได้');
  expect(await page.evaluate(() => getSelection()?.toString())).toBe(await output(page).textContent());
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  await page.getByRole('button', { name: 'คัดลอก', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Ctrl+C');
});

test('missing or failed Web Crypto never emits insecure output and can recover', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(crypto, 'getRandomValues', { configurable: true, value: undefined }));
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('สุ่มอย่างปลอดภัยไม่ได้');
  await expect(output(page)).toBeEmpty();
  await expect(page.getByRole('button', { name: 'คัดลอก', exact: true })).toBeDisabled();
  await page.evaluate(() => Object.defineProperty(crypto, 'getRandomValues', { configurable: true, value: () => { throw new Error('provider failure'); } }));
  await page.getByRole('button', { name: 'ขำใหม่อีกที' }).click();
  await expect(output(page)).toBeEmpty();
  await page.evaluate(() => { delete (crypto as unknown as Record<string, unknown>).getRandomValues; });
  await page.getByRole('button', { name: 'ขำใหม่อีกที' }).click();
  await expect(output(page)).toHaveText(/^\d{50}$/);
});

test('keyboard, reduced motion, technical disclosure and accessibility audit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const input = page.getByLabel('ความยาวเสียงขำ');
  await input.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'ขำใหม่อีกที' })).toBeFocused();
  const before = await output(page).textContent();
  await page.keyboard.press('Enter');
  await expect(output(page)).not.toHaveText(before!);
  expect(await output(page).evaluate(el => el.getAnimations().length)).toBe(0);
  await page.getByText('Web Crypto · P(5) = 1/901', { exact: true }).click();
  await expect(page.getByText(/ไม่ใช่เลขฐานสิบที่มีโอกาสเท่ากัน/)).toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('real Chromium clipboard integration', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'WebKit clipboard permissions cannot be granted through Playwright');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(output(page)).toHaveText(/^\d{50}$/);
  const expected = await output(page).textContent();
  await page.getByRole('button', { name: 'คัดลอก', exact: true }).click();
  await expect(page.getByRole('button', { name: 'คัดลอกแล้ว!' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
});

test('page has no CSP console errors, inline scripts or external application requests', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => {
    if (new URL(request.url()).origin !== new URL(process.env.TEST_BASE_URL ?? 'http://127.0.0.1:4319').origin) external.push(request.url());
  });
  const response = await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(output(page)).toHaveText(/^\d{50}$/);
  await expect(page.locator('script:not([src])')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  if (process.env.TEST_BASE_URL) {
    expect(response!.headers()['cache-control']).toContain('no-transform');
    expect(response!.headers()['content-security-policy']).not.toContain('unsafe-inline');
  }
});
