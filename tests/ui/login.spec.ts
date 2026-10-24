
import { test, expect } from '@playwright/test';

test.describe('Login module - controlled fixture', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <main>
        <h1>Login</h1>
        <form id="login-form">
          <label for="email">Email</label>
          <input id="email" type="email" required />

          <label for="password">Password</label>
          <input id="password" type="password" required />

          <button type="submit">Sign in</button>
          <button type="button" id="forgot">Forgot password?</button>
          <p id="message" role="status"></p>
        </form>
      </main>

      <script>
        const form = document.querySelector('#login-form');
        const message = document.querySelector('#message');
        let failures = 0;

        form.addEventListener('submit', event => {
          event.preventDefault();

          const email = document.querySelector('#email').value;
          const password = document.querySelector('#password').value;

          if (email === 'user@example.com' && password === 'CorrectPass123!') {
            message.textContent = 'Login successful';
            failures = 0;
          } else {
            failures++;
            message.textContent =
              failures >= 3
                ? 'Account temporarily locked'
                : 'Invalid email or password';
          }
        });

        document.querySelector('#forgot').addEventListener('click', () => {
          message.textContent = 'Password reset instructions requested';
        });
      </script>
    `);
  });

  test('LOGIN-001: valid credentials show successful login', async ({ page }) => {
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('CorrectPass123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('status')).toHaveText('Login successful');
  });

  test('LOGIN-002: invalid credentials show an error', async ({ page }) => {
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('WrongPassword!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('status')).toHaveText(
      'Invalid email or password'
    );
  });

  test('LOGIN-003: forgot password shows reset confirmation', async ({ page }) => {
    await page.getByRole('button', { name: 'Forgot password?' }).click();

    await expect(page.getByRole('status')).toHaveText(
      'Password reset instructions requested'
    );
  });

  test('LOGIN-004: repeated failures trigger the fixture lockout', async ({ page }) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.locator('#email').fill('user@example.com');
      await page.locator('#password').fill('WrongPassword!');
      await page.getByRole('button', { name: 'Sign in' }).click();
    }

    await expect(page.getByRole('status')).toHaveText(
      'Account temporarily locked'
    );
  });

  test('LOGIN-005: required fields prevent an empty submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('#email')).toHaveAttribute('required', '');
    await expect(page.locator('#password')).toHaveAttribute('required', '');
    await expect(page.getByRole('status')).toBeEmpty();
  });
});
