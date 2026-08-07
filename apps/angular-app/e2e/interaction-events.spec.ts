import { expect, test, type Page } from 'playwright/test';

const consoleErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  consoleErrors.set(page, errors);
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(consoleErrors.get(page)).toEqual([]);
});

test('shows every snackbar variant from its native button click', async ({
  page,
}) => {
  await page.goto('/snackbar');

  const showButtons = page.getByRole('button', { name: 'Show Snackbar' });
  const snackbars = page.locator('m3-snackbar');

  for (let index = 0; index < 3; index += 1) {
    await showButtons.nth(index).click();
    await expect(snackbars.nth(index)).toHaveAttribute('open', '');
  }
});

test('opens menus and reports the selected item', async ({ page }) => {
  await page.goto('/menu');

  const menu = page.locator('.menu-demo m3-menu').first();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('menuitem', { name: /Profile/ }).click();
  await expect(page.getByText('Last selection:')).toContainText('Profile');
  await expect(menu).not.toHaveAttribute('open', '');
});

test('updates radio, checkbox, and slider demos from native events', async ({
  page,
}) => {
  await page.goto('/radio-buttons');
  await page.getByRole('radio', { name: 'Dark theme' }).click();
  await expect(
    page.getByText('Selected:', { exact: false }).first(),
  ).toContainText('dark');

  await page.goto('/checkboxes');
  await page.getByRole('checkbox', { name: 'Accept terms' }).click();
  await expect(page.getByText('Accepted:')).toContainText('Yes');

  await page.goto('/sliders');
  const volume = page.getByRole('slider', { name: 'Volume' });
  await volume.press('ArrowRight');
  await expect(page.getByText('Volume Value:')).toContainText('51');
});

test('updates and clears search results through native input events', async ({
  page,
}) => {
  await page.goto('/search-bar');

  await page
    .getByRole('searchbox', { name: 'Search', exact: true })
    .fill('alpha');
  await expect(page.getByText('Result 1 for "alpha"')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByText('Result 1 for "alpha"')).not.toBeVisible();
});

test('renders the disabled search bar before any user interaction', async ({
  page,
}) => {
  await page.goto('/search-bar');

  const disabledSearch = page.getByRole('searchbox', {
    name: 'Disabled search',
  });
  await expect(disabledSearch).toBeDisabled();
  await expect(
    page.locator(
      'm3-search-bar[aria-label="Disabled search"] .search-bar',
    ),
  ).toHaveCSS('opacity', '0.38');
});

test('starts the button loading demo from a native click', async ({ page }) => {
  await page.goto('/buttons');

  const loadingDemo = page
    .locator('m3-button')
    .filter({ hasText: 'Submit Form' });
  await loadingDemo.getByRole('button', { name: 'Submit Form' }).click();
  await expect(loadingDemo).toHaveAttribute('loading', '');
});
