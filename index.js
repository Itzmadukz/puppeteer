const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://ebay.ca')
    await page.type('#gh-ac', 'macbook pro');
    await page.click('input[value="Search"]')

    await page.waitForSelector('span.s-item__price')

       console.log( await page.$$eval('span.s-item__price', spans => { 
            return [...spans].map(span => { 
                return span.innerText;
            })
        }))
})()