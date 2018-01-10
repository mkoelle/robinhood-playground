const puppeteer = require('puppeteer');

module.exports = async ticker => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(`https://finance.yahoo.com/quote/${ticker}`);

        const sel = '#quote-header-info > div:nth-child(3) > div:nth-child(1) > div > span:nth-child(1)';
        const returnVal = await page.evaluate((sel) => document.querySelector(sel).textContent, sel);

        await browser.close();
        console.log('current price', ticker, returnVal);
        return Number(returnVal)
    } catch (e) {
        return null;
    }
};
