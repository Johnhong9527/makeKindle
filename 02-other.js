const fs = require('fs');
const moment = require('moment');
const shell = require('shelljs');
const utils = require('./utils/base');
const config = require('./utils/config');
const _list = require('./utils/list');
config.uid = moment().format();
config.time = moment().format('YYYY-MM-DD');

function mkdir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

shell.exec('rm -rf book && mkdir book');

mkdir('./book/META-INF');

fs.writeFileSync('./book/META-INF/container.xml', utils.container());
fs.writeFileSync('./book/mimetype', 'application/epub+zip');

mkdir('./book/OEBPS');
mkdir('./book/OEBPS/Images');
mkdir('./book/OEBPS/Styles');
fs.writeFileSync('./book/OEBPS/Styles/mc-style.css', utils.style());
mkdir('./book/OEBPS/Text');
fs.writeFileSync('./book/OEBPS/Text/cover.xhtml', utils.cover());

// opf toc.ncx ...
utils.opf(config, _list).then(res => {
  fs.writeFileSync('./book/OEBPS/content.opf', res);
  return utils.tocNcx(config, _list);
}).then(res => {
  fs.writeFileSync('./book/OEBPS/toc.ncx', res);
  return utils.book(config);
}).then(res => {
  fs.writeFileSync('./book/OEBPS/Text/book.xhtml', res);
});
console.log('基本目录结构创建完毕！');
