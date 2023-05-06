const puppeteer = require('puppeteer');

async function login(user, pass, url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  await page.type('input[name="email"]', user);
  await page.type('input[name="Clave"]', pass);
  await Promise.all([
    page.click('.btn-span-enter'),
    page.waitForNavigation()
  ]);
  return {browser, page};
}

async function stopLoading(page) {
  try {
    await page.waitForSelector('.user-info-loader', { hidden: true, timeout: 20000 });
    return true;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      return true;
    }
    throw error;
  }
}

async function scrappFromUserInfoDiv(user, pass, url) {
  const {browser, page} = await login(user, pass, url);
  await page.waitForSelector('.user-info', { timeout: 20000 });
  await stopLoading(page);
  const infoRows = await page.$$('.info-row');
  const getRowInfo = async (row) => {
    const category = await row.$eval('strong', (el) => el.textContent);
    const value = await row.$eval('span', (el) => el.textContent);
    return { category, value };
  };
  const userInfo = await Promise.all(infoRows.map((row) => getRowInfo(row)));
  await browser.close();
  return userInfo;
}

const jumboScrapper = async (user, pass) => {
  const url = 'https://www.jumbo.cl/login-page?callback=/mis-datos';
  const userInfo = await scrappFromUserInfoDiv(user, pass, url);
  console.info(userInfo)
  return userInfo;
}

module.exports = jumboScrapper;