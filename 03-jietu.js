const express = require('express');
const shell = require('shelljs');
const app = express();

app.use(express.static('cover'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
const pid = process.pid;
// return
const puppeteer = require('puppeteer');

const utils = require('./utils/base');

const start = async (utils) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');

  //调用evaluate 方法返回id 为form元素的位置信息
  let clip = await page.evaluate((utils) => {
    // 设置标题
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    title.innerText = utils.name;
    author.innerText = utils.author;
    let {
      x,
      y,
      width,
      height
    } = document.getElementById('page').getBoundingClientRect();
    return {
      x,
      y,
      width,
      height
    };
  }, utils);

  await page.screenshot({
    path: './book/OEBPS/Images/cover.jpg',
    clip: clip //设置clip 属性
  });
  await page.close();
  await browser.close();
  shell.exec(`kill ${pid}`);
}

start(utils);
