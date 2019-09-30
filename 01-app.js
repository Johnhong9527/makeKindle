const puppeteer = require('puppeteer');
const fs = require("fs");
const shell = require('shelljs');
const config = require('./utils/config');
// 开启代理
shell.exec('export https_proxy=http://127.0.0.1:7890;export http_proxy=http://127.0.0.1:7890;export all_proxy=socks5://127.0.0.1:1080');
(async () => {
  const browser = await puppeteer.launch({
    // executablePath: './chromium/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],  // 沙箱模式下运行
    // headless: false, //默认为true（无头），不显示浏览器界面
    // slowMo: 200, //减速显示，有时会作为模拟人操作特意减速
    // devtools: true //显示开发者工具。页面宽高默认800*600,把开发者工具显示再隐藏页面会占满屏幕，有没有大佬解释下？
  });
  //生成Page对象
  //const page = await browser.newPage();//官网写法：一打开浏览器会打开两个tab，第二个才是你正在操作的tab
  const page = (await browser.pages())[0]; //这是我的写法，只有一个tab
  // await page.goto(config.url); //跳转到掘金
  await page.goto(config.url); //跳转到掘金

  //请开始你的表演...
  const result = await page.evaluate((config) => {

    return new Promise(resolve => {
      // let $titles = document.querySelector('.cell-items').getElementsByTagName('li');
      // let $titles = document.getElementsByTagName('dd');
      // let $titles = document.getElementsByClassName('chapter_list');
      let titles = [];
      let arr = [];
      let index = 0;
      let y = 0;
      // const len = $titles.length;
      // const len = 50;
      let _tr = document.getElementsByTagName('table')[4].getElementsByTagName('tr');
      // console.log(_tr)
      // return
      for (let l = 1; l < _tr.length; l++) {
        let _td = _tr[l].getElementsByTagName('td');
        for (let j = 0; j < 2; j++) {
          for (let i = 0; i < _td.length; i++) {
            if (index < 194) {
              let _div = _td[i].getElementsByTagName('div')[j];
              let _title = _div.innerText;
              let _url = _div.getElementsByTagName('a')[0].getAttribute('href');
              arr.push({
                href: _url,
                title: _title,
                index: index + 1
              });
              index++
            }

          }
          // let _div = _td[j].getElementsByTagName('div');
          // console.log(_td[j].innerText)
        }
        // console.log(_tr[l]);
      }
      // console.log(arr);
      resolve(arr);
      /* let _td = document.getElementsByTagName('table')[4].getElementsByTagName('tr')[1].getElementsByTagName('td')[0].getElementsByTagName('div')
      let other = [];
      for(let j = 0;j<2;j++){
        for (let i = 0; i < arr.length; i++) {
          // other[0].push(arr[0][0])
          let _title = _tr[]
          other.push(arr[i][j])
        }
      }    */
      // console.log(_tr);

      return
      const interval = setInterval(() => {
        if (index === len) {
          titles = titles.splice(9, len);
          titles.map((key, i) => {
            key.index = i + 1;
          });
          resolve(titles);
          clearInterval(interval);
          return;
        }
        if (y > 2) {
          y = 0;
          for (let i = 2; i > -1; i--) {
            titles.push(arr[i]);
            console.log(arr[i].title)
            console.log(titles)
          }
          arr = []
        }
        let title_dom = $titles[index].getElementsByTagName('a')[0];
        arr.push({
          href: `${config.href}${title_dom.getAttribute('href')}`,
          title: title_dom.innerText,
          index: index + 1
        });
        // console.log(arr)
        index += 1;
        y += 1;
      }, 200);
    });
  }, config);
  await browser.close(); //关闭浏览器
  console.log('over');
  fs.writeFileSync('./utils/list.js', 'module.exports =' + JSON.stringify(result));
  // 执行其他命令
  shell.exec('node 02-other.js');
  shell.exec('node 03-jietu.js');
})();
