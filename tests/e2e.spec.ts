// tests/e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tawakal Bar B.Q core flows', () => {
  test('All images load on homepage and menu', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (resp) => {
      const ct = resp.headers()['content-type'];
      if (ct && ct.startsWith('image/') && resp.status() !== 200) {
        failed.push(`${resp.url()} -> ${resp.status()}`);
      }
    });
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3002/menu');
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
  });

  test('Place order flow works end-to-end', async ({ page }) => {
    // Navigate to menu
    await page.goto('http://localhost:3002/menu');
    await page.waitForLoadState('networkidle');
    // Click first Add to Cart button
    const addBtn = await page.$('text=Add to Cart');
    if (!addBtn) test.fail(true, 'Add to Cart button not found');
    await addBtn?.click();
    // Go to cart
    await page.goto('http://localhost:3002/cart');
    await page.waitForLoadState('networkidle');
    // Proceed to checkout
    const checkoutBtn = await page.$('text=Proceed to Checkout');
    if (!checkoutBtn) test.fail(true, 'Checkout button not found');
    await checkoutBtn?.click();
    await page.waitForURL('**/checkout');
    // Fill order form (adjust selectors as needed)
    await page.fill('input[placeholder="e.g. Muhammad Ali"]', 'Test User');
    // Email field not present in form; skipping
    await page.fill('input[placeholder="+92 343 1265090"]', '03001234567');
    // Address fields are split
    await page.fill('input[placeholder="e.g. 9178"]', '101');
    await page.fill('input[placeholder="e.g. Street 5, Main Rd"]', 'Test Street');
    // Place order and capture request
    const [orderResp] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/orders') && resp.request().method() === 'POST'),
      page.click('button:has-text("PLACE ORDER")'),
    ]);
    expect(orderResp.ok()).toBeTruthy();
    const data = await orderResp.json();
    expect(data).toHaveProperty('orderNumber');
    await page.waitForURL(`**/order/${data.orderNumber}**`);
    // Verify cart cleared
    await page.goto('http://localhost:3002/cart');
    const emptyMsg = await page.textContent('text=Your cart is empty');
    expect(emptyMsg).toContain('Your cart is empty');
  });
});
