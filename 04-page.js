const fs = require("fs");
const puppeteer = require('puppeteer');
const utils = require('./utils/base');
var $xindaming = require('./xindaming');
const len = $xindaming.length;
let index = 0;

const createPage = async (url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true, //默认为true（无头），不显示浏览器界面
    // slowMo: 200,
  });
  const page = (await browser.pages())[0]; //这是我的写法，只有一个tab
  await page.goto(url); //跳转到掘金
  const result = await page.evaluate(() => {
    return new Promise(resolve => {
      let content = {
        title: document.getElementsByTagName('h1')[0].innerText,
        page: document.getElementsByClassName('main1')[1].getElementsByTagName('p')[0].innerText
      };
      resolve(content);
    });
  });
  await browser.close(); //关闭浏览器
  return result;
};
forEachUrl();

function forEachUrl() {
  if ($xindaming[index] !== undefined) {
    console.clear();
    console.log(`还剩${len - index};  当前进度:${$xindaming[index].index}  ${$xindaming[index].title}`);
    createPage($xindaming[index].href).then(res => {
      return utils.page($xindaming[index], res);
    }).then(res => {
      fs.writeFileSync('./book/OEBPS/Text/text' + $xindaming[index].index + '.xhtml', res);
      setTimeout(() => {
        index += 1;
        forEachUrl();
      }, 200);
    });
  }
}
