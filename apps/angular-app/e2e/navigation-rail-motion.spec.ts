import { expect, test } from 'playwright/test';

test('restores the saved rail width and animates opening and closing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    localStorage.setItem('railExpanded', 'false');
  });
  await page.goto('/buttons');

  const root = page.locator('html');
  const shell = page.locator('.desktop-nav-shell');
  await expect(root).toHaveAttribute('data-rail-ready', '');
  await expect(root).toHaveAttribute('data-rail-expanded', 'false');
  await expect(shell).toHaveCSS('width', '80px');

  const widthAfterTwoFrames = () =>
    shell.evaluate(
      (element) =>
        new Promise<number>((resolve) => {
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              resolve(element.getBoundingClientRect().width),
            ),
          );
        }),
    );

  await page.getByRole('button', { name: 'Expand navigation' }).click();
  const openingWidth = await widthAfterTwoFrames();
  expect(openingWidth).toBeGreaterThan(80);
  expect(openingWidth).toBeLessThan(256);
  await expect(shell).toHaveCSS('width', '256px');

  await page.getByRole('button', { name: 'Collapse navigation' }).click();
  const closingWidth = await widthAfterTwoFrames();
  expect(closingWidth).toBeGreaterThan(80);
  expect(closingWidth).toBeLessThan(256);
  await expect(shell).toHaveCSS('width', '80px');
  await expect(root).toHaveAttribute('data-rail-expanded', 'false');
});

test('settles immediately when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/buttons');
  await expect(page.locator('html')).toHaveAttribute('data-rail-ready', '');

  const shell = page.locator('.desktop-nav-shell');
  await page.getByRole('button', { name: 'Collapse navigation' }).click();
  await expect(shell).toHaveCSS('width', '80px');
  const duration = await shell.evaluate((element) =>
    getComputedStyle(element).transitionDuration,
  );
  expect(duration).toBe('0.001s');
});
