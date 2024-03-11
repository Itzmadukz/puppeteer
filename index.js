const puppeteer = require('puppeteer');


// test retailer data
const ebayData = {
    url: 'https://ebay.ca',
    searchSelector: '#gh-ac',
    clickSelector: 'input[value="Search"]',
    priceSelector: 'span.s-item__price'
}

const extractAndTrimNumbers = dataArray => {
    let lowest = null;
    let highest = null;

    dataArray.forEach(item => {
        if (item !== '$20.00') {
            const matches = item.match(/[\d,.]+/g);
            if (matches) {
                const trimmedValues = matches.map(match => parseFloat(match.replace(/,/g, '')));

                // Update lowest and highest values
                if (trimmedValues.length > 0) {
                    const currentLowest = Math.min(...trimmedValues);
                    const currentHighest = Math.max(...trimmedValues);

                    if (lowest === null || currentLowest < lowest) {
                        lowest = currentLowest;
                    }

                    if (highest === null || currentHighest > highest) {
                        highest = currentHighest;
                    }
                }
            }
        }
    });

    return [lowest, highest];
}

const crawlRetailer = async ({ url, searchSelector, clickSelector, priceSelector }) => {

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    try {
        await page.goto(url)
        await page.type(searchSelector, '16-inch Macbook Pro 2023');
        await page.click(clickSelector)

        await page.waitForSelector(priceSelector)

        const prices = await page.$$eval(priceSelector, elements => {
            return [...elements].map(element => {
                return element.innerText;
            })
        })

        console.log(prices)
        console.log("==========================")
        console.log(extractAndTrimNumbers(prices))
    } catch (error) {
        console.log("Error Occured", error)

    }

}

console.log(crawlRetailer(ebayData))