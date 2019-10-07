const puppeteer = require("puppeteer");
const fs = require("fs");
const shell = require("shelljs");
const config = require("./utils/config");
// 开启代理
shell.exec("export https_proxy=http://127.0.0.1:7890;export http_proxy=http://127.0.0.1:7890;export all_proxy=socks5://127.0.0.1:1080");
(async () => {
    const browser = await puppeteer.launch({
        // executablePath: './chromium/chrome.exe',
        // args: ["--no-sandbox", "--disable-setuid-sandbox"],  // 沙箱模式下运行
        headless: false, //默认为true（无头），不显示浏览器界面
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
            let $titles = document.getElementsByClassName('box_con')[1].getElementsByTagName('li');
            // console.log($titles);
            // console.log($titles[0].getElementsByTagName("a")[0]);
            // console.log($titles[1].getElementsByTagName("a")[0]);
            // console.log($titles[2].getElementsByTagName("a")[0]);
            // return
            let titles = [];
            let index = 0;
            const len = $titles.length;
            const interval = setInterval(() => {
                if (index === len) {
                    titles = titles.splice(0, len);
                    titles.map((key, i) => {
                        key.index = i + 1;
                    });
                    resolve(titles);
                    clearInterval(interval);
                    return;
                }
                // console.log($titles[index]);
                console.log($titles[index].getElementsByTagName("a")[0]);
                if ($titles[index].getElementsByTagName("a").length > 0) {
                    titles.push({
                        href: `${config.href}${$titles[index].getElementsByTagName("a")[0].getAttribute("href")}`,
                        title: $titles[index].getElementsByTagName("a")[0].innerText,
                        index: index + 1,
                    });
                }
                index += 1;

            }, 100);
        });
    }, config);
    await browser.close(); //关闭浏览器
    console.log("over");
    fs.writeFileSync("./utils/list.js", "module.exports =" + JSON.stringify(result));
    // 执行其他命令
    shell.exec("node 02-other.js");
    shell.exec("node 03-jietu.js");
})();
