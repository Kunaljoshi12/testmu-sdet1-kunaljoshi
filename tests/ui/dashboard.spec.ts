
import { test, expect } from '@playwright/test';

test.describe('Dashboard module - controlled fixture', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <main>
        <h1>Dashboard</h1>

        <section aria-label="Summary widgets">
          <article data-testid="revenue-widget">
            <h2>Revenue</h2>
            <p data-testid="revenue-value">1200</p>
          </article>

          <article data-testid="orders-widget">
            <h2>Orders</h2>
            <p data-testid="orders-value">30</p>
          </article>
        </section>

        <label for="sort-order">Sort orders</label>
        <select id="sort-order">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <ul id="orders">
          <li data-amount="300">Order A: 300</li>
          <li data-amount="100">Order B: 100</li>
          <li data-amount="200">Order C: 200</li>
        </ul>

        <button id="filter">Show orders over 150</button>

        <section aria-label="Restricted information">
          <p data-testid="admin-data" hidden>Admin-only information</p>
        </section>
      </main>

      <script>
        const orders = document.querySelector('#orders');
        const originalItems = Array.from(orders.children);

        document.querySelector('#sort-order').addEventListener('change', event => {
          const sorted = [...originalItems].sort((a, b) => {
            const difference = Number(a.dataset.amount) - Number(b.dataset.amount);
            return event.target.value === 'asc' ? difference : -difference;
          });
          orders.replaceChildren(...sorted);
        });

        document.querySelector('#filter').addEventListener('click', () => {
          for (const item of orders.children) {
            item.hidden = Number(item.dataset.amount) <= 150;
          }
        });
      </script>
    `);
  });

  test('DASH-001: dashboard widgets load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByTestId('revenue-widget')).toBeVisible();
    await expect(page.getByTestId('orders-widget')).toBeVisible();
  });

  test('DASH-002: widget values match fixture data', async ({ page }) => {
    await expect(page.getByTestId('revenue-value')).toHaveText('1200');
    await expect(page.getByTestId('orders-value')).toHaveText('30');
  });

  test('DASH-003: orders can be sorted ascending', async ({ page }) => {
    await page.locator('#sort-order').selectOption('asc');

    const amounts = await page.locator('#orders li').allTextContents();
    expect(amounts).toEqual([
      'Order B: 100',
      'Order C: 200',
      'Order A: 300',
    ]);
  });

  test('DASH-004: filter hides orders of 150 or less', async ({ page }) => {
    await page.getByRole('button', { name: 'Show orders over 150' }).click();

    await expect(page.locator('#orders li:visible')).toHaveCount(2);
    await expect(page.getByText('Order B: 100')).toBeHidden();
  });

  test('DASH-005: restricted information is hidden by default', async ({ page }) => {
    await expect(page.getByTestId('admin-data')).toBeHidden();
  });

  test('DASH-006: dashboard renders at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByTestId('revenue-widget')).toBeVisible();
    await expect(page.getByTestId('orders-widget')).toBeVisible();
  });
});
