import { expect, test } from 'playwright/test';

const menuSelector = 'm3-menu[placement="right-start"]';

test.beforeEach(async ({ page }) => {
  await page.goto('/home');
});

test('keeps the Components menu open through the offset bridge and routes a selected item', async ({
  page,
}) => {
  const trigger = page.locator('#desktop-components-trigger');
  const bridge = page.locator('.desktop-components-menu-bridge');
  const menu = page.locator(menuSelector);
  const mobileMenu = page.locator('m3-menu[placement="top-center"]');

  await trigger.hover();
  await expect(menu).toHaveAttribute('open', '');
  await expect(mobileMenu).not.toHaveAttribute('open', '');

  await bridge.hover();
  await page.waitForTimeout(225);
  await menu.hover();
  await expect(menu).toHaveAttribute('open', '');

  await menu.getByRole('menuitem', { name: 'smart_button Buttons' }).click();
  await expect(page).toHaveURL(/\/buttons$/);
  await expect(menu).not.toHaveAttribute('open', '');
});

test('opens from physical and keyboard trigger activation and restores focus on Escape', async ({
  page,
}) => {
  const triggerButton = page.locator('#desktop-components-trigger').locator('button');
  const menu = page.locator(menuSelector);
  const firstItem = menu.getByRole('menuitem').first();

  await triggerButton.click();
  await expect(menu).toHaveAttribute('open', '');
  await expect(firstItem).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(triggerButton).toBeFocused();

  for (const key of ['Enter', 'Space', 'ArrowRight']) {
    await triggerButton.focus();
    await triggerButton.press(key);
    await expect(menu).toHaveAttribute('open', '');
    await expect(firstItem).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(triggerButton).toBeFocused();
  }
});
