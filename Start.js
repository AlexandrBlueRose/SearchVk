const puppeteer = require('puppeteer');


let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //await page.goto('https://habr.com/top')
    await page.goto('https://vk.com/id271572369');
    await page.type('#quick_email', '');
    await page.type('#quick_pass', '');
    await page.click('#quick_login_button');
    await page.screenshot();
    await page.waitFor(2000)
    await browser.close();
    return 'ok';
};
scrape().then((value) => {
    console.log(value);
})