const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  const dimensions = await page.evaluate(() => {
    return {}
  });

  await page.screenshot({path: 'example.png'});
  await browser.close();
})();
