const puppeteer = require('puppeteer');
const fs = require("fs");
(async () => {
  const browser = await puppeteer.launch({
    // executablePath: './chromium/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true, //默认为true（无头），不显示浏览器界面
    slowMo: 200, //减速显示，有时会作为模拟人操作特意减速
    devtools: true //显示开发者工具。页面宽高默认800*600,把开发者工具显示再隐藏页面会占满屏幕，有没有大佬解释下？
  });
  //生成Page对象
  //const page = await browser.newPage();//官网写法：一打开浏览器会打开两个tab，第二个才是你正在操作的tab
  const page = (await browser.pages())[0]; //这是我的写法，只有一个tab
  await page.goto('https://www.qu.la/book/27473/'); //跳转到掘金

  //请开始你的表演...
  const result = await page.evaluate(() => {

    return new Promise(resolve => {
      // let $titles = document.querySelector('.cell-items').getElementsByTagName('li');
      let $titles = document.getElementsByTagName('dd');
      let titles = [];
      let index = 0;
      const len = $titles.length;
      const interval = setInterval(() => {
        if (index === len) {
          resolve(titles);
          clearInterval(interval);
          return;
        }
        console.log($titles[index]);
        titles.push({
          href: `https://www.qu.la${$titles[index].getElementsByTagName('a')[0].getAttribute('href')}`,
          title: $titles[index].getElementsByTagName('a')[0].innerText,
          index: index + 1
        });
        index += 1;
      }, 30);
    });


  });
  await browser.close(); //关闭浏览器
  console.log('over');
  fs.writeFileSync('./xindaming.js', 'module.exports =' + JSON.stringify(result));
})();
