# 爬取小说并制作epub或mobi格式的电子书

### ～/utils/config.js
设置待下载小说的基本信息

### 安装依赖
node版本>=10.x
```bash
npm install
```

### 设置需要下载的小说信息
url：～/utils/config.js
```
name: '***', 小说名字
author: '***', 作者姓名
url: 'https://www.qu.la/book/20616/', 小说目录
href: 'https://www.qu.la' // 提取目录页章节链接时，补充链接完整
```

### 运行
```bash
# 第一步：获取小说章节列表，并生成电子书基本目录格式
node 01-app.js
# 第二步：爬取单个章节的所有内容
node 04-page.js
```
爬取过程出现网络波动，可根据爬取进度，设置`04-page.js`中的`index`的值，该值为当前进度-1


### 
电子书制作
```
//*[re:test(., "^\s*[第卷][0123456789一二三四五六七八九十零〇百千两]*[章回部节集卷].*", "i")]
```
