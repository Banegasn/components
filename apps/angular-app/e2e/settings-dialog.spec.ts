import { expect, test } from 'playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/home');
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('rtl', 'false');
    localStorage.setItem('motion', 'system');
  });
  await page.reload();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
});

test('applies theme, motion, and direction from the settings switches', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const root = page.locator('html');
  const darkMode = page.getByRole('switch', { name: 'Enable dark mode' });
  const reducedMotion = page.getByRole('switch', {
    name: 'Enable reduced motion verification',
  });
  const rtl = page.getByRole('switch', { name: 'Enable RTL layout' });

  await darkMode.click();
  await expect(root).toHaveAttribute('theme', 'dark');

  await reducedMotion.click();
  await expect(root).toHaveAttribute('data-motion', 'reduced');

  await rtl.click();
  await expect(root).toHaveAttribute('dir', 'rtl');

  await expect
    .poll(() =>
      page.evaluate(() => ({
        theme: localStorage.getItem('theme'),
        motion: localStorage.getItem('motion'),
        rtl: localStorage.getItem('rtl'),
      })),
    )
    .toEqual({ theme: 'dark', motion: 'reduced', rtl: 'true' });

  await darkMode.click();
  await reducedMotion.click();
  await rtl.click();
  await expect(root).toHaveAttribute('theme', 'light');
  await expect(root).not.toHaveAttribute('data-motion');
  await expect(root).not.toHaveAttribute('dir');
  expect(consoleErrors).toEqual([]);
});
