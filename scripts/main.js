import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import { login } from './login.js';
import { diff } from './diff.js';
import { config } from './config.js';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--single-process',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-blink-features=AutomationControlled',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 934 });

  await login(page);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  page.on('requestfailed', (request) => {
    console.log('Request failed:', request.url(), request.failure().errorText);
  });

  page.on('response', (response) => {
    if (!response.ok()) {
      console.log('Response error:', response.status(), response.url());
    }
  });

  await page
    .goto(config.pageUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    })
    .catch(async (error) => {
      console.error('First attempt failed, retrying...', error);
      await page.goto(config.pageUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
    });

  await page.waitForSelector('#root');

  const root = await page.$('#root');
  const pagePath = `kms-home-page-${dayjs().format('YYYYMMDDHHmm')}.png`;
  await root.screenshot({
    path: pagePath,
  });

  await browser.close();

  diff(pagePath, 'kms-home-page.png');
}

main();
