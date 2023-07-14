const puppeteer = require('puppeteer');
const fs = require('fs');

const url =
  'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops';

async function scrapeLenovoLaptops(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const lenovoLaptops = await page.evaluate(() => {
    const laptopList = [];
    const laptopNodes = document.querySelectorAll('.thumbnail');

    laptopNodes.forEach((node) => {
      const laptopJson = {};
      const laptopName = node.querySelector('a.title').getAttribute('title');
      const laptopPrice = node.querySelector('h4.pull-right.price').innerText;

      if (laptopName.includes('Lenovo')) {
        laptopJson.name = laptopName;
        laptopJson.price = laptopPrice;
        laptopList.push(laptopJson);
      }
    });

    return laptopList.sort((a, b) => {
      return a.price - b.price;
    });
  });

  const jsonData = JSON.stringify(lenovoLaptops, null, 2);

  fs.writeFile('lenovoLaptops.json', jsonData, (err) => {
    if (err) {
      console.error('An error occurred while writing to the file:', err);
      return;
    }
    console.log('Data saved successfully.');
  });

  await browser.close();
}

scrapeLenovoLaptops(url);