import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import fs from 'fs';
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
      '--font-render-hinting=none',
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

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!fs.existsSync('benchmark-images')) {
    fs.mkdirSync('benchmark-images');
    const pagePath = `benchmark-images/kms-home-page.png`;
    await page.screenshot({ path: pagePath, fullPage: true });
    await browser.close();
    return;
  }

  const pagePath = `kms-home-page-${dayjs().format('YYYYMMDDHHmm')}.png`;
  await page.screenshot({
    path: pagePath,
    fullPage: true,
  });
  await browser.close();

  diff(pagePath, 'benchmark-images/kms-home-page.png');
}

main();
