import { test as setup } from '@playwright/test';
import { loginPage } from '../pages/login';

setup('authenticate', async ({ page }) => {
  const login = new loginPage(page);
  await login.loginAsUser();
});
