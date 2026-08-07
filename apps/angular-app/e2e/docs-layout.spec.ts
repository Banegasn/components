import { expect, test } from 'playwright/test';

const documentationRoutes = [
  '/quick-start',
  '/components',
  '/buttons',
  '/cards',
  '/navigation-rail',
  '/navigation-bar',
  '/switches',
  '/radio-buttons',
  '/checkboxes',
  '/sliders',
  '/text-fields',
  '/chips',
  '/dialog',
  '/tooltip',
  '/badge',
  '/divider',
  '/list',
  '/progress',
  '/tabs',
  '/search-bar',
  '/split-button',
  '/menu',
  '/loading-indicator',
  '/fab-menu',
  '/icon-button',
  '/top-app-bar',
  '/snackbar',
  '/contact',
] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('rtl', 'false');
    localStorage.setItem('railExpanded', 'true');
  });
});

test('every documentation route uses the shared page layout', async ({
  page,
}) => {
  test.setTimeout(60_000);

  for (const route of documentationRoutes) {
    await page.goto(route);

    await expect(page.locator('app-page-header')).toHaveCount(1);
    await expect(page.locator('#route-page-title')).toBeVisible();
    await expect(page.locator('.route-content .docs-page')).toBeVisible();
    await expect(page.locator('.docs-page .page-header')).toHaveCount(0);

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(
      hasHorizontalOverflow,
      `${route} should not overflow horizontally`,
    ).toBe(false);
  }
});

test('home keeps its focused hero while using the shared app shell', async ({
  page,
}) => {
  await page.goto('/home');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Build expressive UIs. Use any framework.',
    }),
  ).toBeVisible();
  await expect(page.locator('app-page-header')).toHaveCount(0);
  await expect(page.locator('.hero-preview')).toBeVisible();
});

test('representative pages remain polished and overflow-free on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of [
    '/home',
    '/components',
    '/buttons',
    '/quick-start',
    '/contact',
  ]) {
    await page.goto(route);
    await expect(page.locator('.mobile-nav-shell')).toBeVisible();
    await expect(page.locator('.desktop-nav-shell')).toBeHidden();

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(hasHorizontalOverflow, `${route} should fit a 390px viewport`).toBe(
      false,
    );
  }
});
