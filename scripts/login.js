import { config } from './config.js';

export async function login(page) {
  await page.goto(config.loginUrl, {
    waitUntil: 'networkidle2',
  });
  await page.type('input[id="username"]', config.username);
  await page.type('input[id="password"]', config.password);
  await page.click('button[type="submit"]');
}
