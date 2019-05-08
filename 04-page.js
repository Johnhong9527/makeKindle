const fs = require("fs");
const puppeteer = require('puppeteer');
const shell = require('shelljs');
const utils = require('./utils/base');
var $xindaming = require('./xindaming');
const len = $xindaming.length;
let index = 1019;

const createPage = async (url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // 沙箱模式下运行
    headless: true, //默认为true（无头），不显示浏览器界面
    // slowMo: 200,
  });
  const page = (await browser.pages())[0]; //这是我的写法，只有一个tab
  await page.goto(url); //跳转到掘金
  const result = await page.evaluate(() => {
    return new Promise(resolve => {
      let content = {
        title: document.getElementsByTagName('h1')[0].innerText,
        page: document.getElementById('content').innerText
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
      }, 30);
    });
  } else {
    shell.exec(`zip -p -r ${utils.name}.epub book`);
    // linux 下执行命令
    // shell.exec(`./utils/kindlegen -c1 ${utils.name}.epub -locale zh`);
    // mac下执行命令
    shell.exec(`/Users/honghaitao/Applications/KindleGen_Mac_i386_v2_9/kindlegen -c1 ${utils.name}.epub -locale zh`);
    // shell.exec(`rm ${utils.name}.epub`);
  }
}
