import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import { login } from './login.js';
import { diff } from './diff.js';
import { config } from './config.js';

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    },
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 934 });

  await login(page);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.goto(config.pageUrl, {
    waitUntil: 'networkidle2',
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
