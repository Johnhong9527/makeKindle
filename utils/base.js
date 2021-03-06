const start = 1;
module.exports = {
  opf: function (info, list) {
    return new Promise(resolve => {
      function item(list) {
        let html = '';
        list.forEach(key => {
          if (startAndEnd(key)) {
            html += `
            <item id="text${key.index}.xhtml" href="Text/text${key.index}.xhtml" media-type="application/xhtml+xml"/>
            `;
          }
        });
        return html;
      }
      
      function itemref(list) {
        let html = '';
        list.forEach(key => {
          if (startAndEnd(key)) {
            html += `
            <itemref idref="text${key.index}.xhtml"/>`;
          }
        });
        return html;
      }
      
      let html = `<?xml version="1.0" encoding="utf-8"?>
      <package version="2.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">
        <metadata xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:creator>${info.author}</dc:creator>
          <dc:language>zh</dc:language>
          <dc:title>${info.name}</dc:title>
          <meta content="0.9.10" name="Sigil version" />
          <dc:date xmlns:opf="http://www.idpf.org/2007/opf" opf:event="modification">${info.time}</dc:date>
          <dc:identifier id="BookId" opf:scheme="UUID">urn:uuid:${info.uid}</dc:identifier>
          <meta name="cover" content="cover.jpg" />
        </metadata>
        <manifest>
          <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
          ${item(list)}
          <item id="book.xhtml" href="Text/book.xhtml" media-type="application/xhtml+xml"/>
          <item id="mc-style.css" href="Styles/mc-style.css" media-type="text/css"/>
          <item id="cover.jpg" href="Images/cover.jpg" media-type="image/jpeg"/>
          <item id="cover.xhtml" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>
        </manifest>
        <spine toc="ncx">
          <itemref idref="cover.xhtml"/>
          <itemref idref="book.xhtml"/>
          ${itemref(list)}
        </spine>
        <guide>
          <reference type="cover" title="封面" href="Text/cover.xhtml"/>
        </guide>
      </package>
      `;
      resolve(html);
    });
  },
  tocNcx: function (info, list) {
    return new Promise(resolve => {
      function navPoint(list) {
        let page = '';
        list.forEach(key => {
          if (startAndEnd(key)) {
            page += `<navPoint id="navPoint-${key.index + 1}" playOrder="${key.index + 1}">
            <navLabel>
              <text>${key.title}</text>
            </navLabel>
            <content src="Text/text${key.index}.xhtml"/>
          </navPoint>`;
          }
        });
        return page;
      }
      
      const html = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN"
         "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
      
      <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
        <head>
          <meta name="dtb:uid" content="urn:uuid:${info.uid}"/>
          <meta name="dtb:depth" content="1"/>
          <meta name="dtb:totalPageCount" content="0"/>
          <meta name="dtb:maxPageNumber" content="0"/>
        </head>
        <docTitle>
          <text>${info.name}</text>
        </docTitle>
        <navMap>
          <navPoint id="navPoint-1" playOrder="1">
            <navLabel>
              <text>制作信息</text>
            </navLabel>
            <content src="Text/book.xhtml"/>
          </navPoint>
          ${navPoint(list)}
        </navMap>
      </ncx>
      `;
      resolve(html);
      
    });
  },
  book: function (info) {
    return new Promise(resolve => {
      const html = `<?xml version="1.0" encoding="utf-8"?>
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
    "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
  
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
    
  <link href="../Styles/mc-style.css" type="text/css" rel="stylesheet"/>
  </head>
  
  <body>
    <h1 class="sigil_not_in_toc">${info.name}</h1>
  
    <div class="author">
      <b>${info.author}</b> <span style="font-size: smaller;">/ 著</span>
    </div>
  
    <div class="copyright">
      排版/制作：飞鼠
    </div>
  
    <p style="text-align: center; font-size: smaller; text-indent: 0;"><a href="http://mebook.cc" target="_blank">www.mebook.cc</a></p>
  </body>
  </html>`;
      resolve(html);
    });
  },
  page: function (item, content) {
    return new Promise(resolve => {
      function page(content) {
        let contents = content.split('\n');
        let html = '';
        contents.forEach(key => {
          html += `
          <p>${key}</p>`;
        });
        return html;
      }
      
      const html = `
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head><title></title>
<link href="../Styles/mc-style.css" type="text/css" rel="stylesheet"/>
</head>
<body>
<h3 id="id${item.index}">${content.title}</h3>
${page(content.page)}
</body>
</html>
`;
      resolve(html);
    });
  },
  cover: function () {
    return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Cover</title>
</head>
<body>
  <div style="text-align: center; padding: 0pt; margin: 0pt;">
    <svg xmlns="http://www.w3.org/2000/svg" height="100%" preserveAspectRatio="xMidYMid meet" version="1.1" viewBox="0 0 240 300" width="100%" xmlns:xlink="http://www.w3.org/1999/xlink">
      <image width="240" height="300" xlink:href="../Images/cover.jpg"/>
    </svg>
  </div>
</body>
</html>`;
  },
  style() {
    return `@charset "UTF-8";

/*=========================font-face=========================*/
@font-face {
	font-family:"zw";
	src:
	local("宋体"),local("明体"),local("明朝"),
	local("微软雅黑"),local("黑体"),
	local("Songti"),local("Songti SC"),local("Songti TC"),
	local("Song S"),local("Song T"),local("STBShusong"),local("TBMincho"),local("HYMyeongJo"),
	local("DK-SONGTI")
	local("Heiti"),local("Heiti SC"),local("Heiti TC"),
	local("MYing Hei S"),local("MYing Hei T"),local("TBGothic"),
	local("DK-HEITI"),
	url(../Fonts/fzzy.ttf);
}

/* This defines styles and classes used in sioebook */

/*Global Setting*/

* {
	margin: 0;
	padding: 0;
}

body {
	padding: 3% 2%;
	margin-top: 3%;
	margin-bottom: 3%;
	margin-left: 1%;
	margin-right: 1%;
	line-height: 1.3em;
	text-align: justify;
	font-family: "Times New Roman","方正书宋","宋体","明体","zw",sans-serif;
}

/* P 正常段落 */
p {
	margin: 0.5em 0em;
	line-height: 1.3em;
	text-indent: 2em;
}

/* 居中、右、左 */
.center {
	text-indent: 0em;
	text-align: center;
}
.right {
	text-indent: 0em;
	text-align: right;
}
.left {
	text-indent: 0em;
	text-align: left;
}

/*图片*/
img {
	border: none;
	text-align: center;
	/*max-width: 100%;*/
	max-height: 100%;
}

/* 表格 */
table {
	border-collapse: collapse;
	border-spacing: 0;
	margin: 0 auto 0;
	width: 100%;
	font-size: small;
	vertical-align:center;
}
tr,th,td {
	margin: 0;
	padding: 0.25em;
	border: none;
	font-size: 95%;
	font-family: "Times New Roman","方正书宋","宋体","明体","zw",sans-serif;
	text-indent: 0!important;
	text-align: left;
	vertical-align: middle;
	color: #666666;
	line-height: 1.05em;
}

/* 列表格式 */
ul, ol	{
	list-style:none;
}
/* 链接 颜色 不加下划线 */
a {
	text-decoration:none;
	color: #663366;
}
a:hover {
	text-decoration:none;
	color: #CC99CC;
}
/* 文案 */
.oval {
	padding: 5% 5%;
	margin: 12% 5% 2%;
	border: 0px dotted #993333;
	text-indent: 0em;
	font-size: 0.9em;
	color: #666666;
}

/* 水平线 */
hr {
	border:0;
	background-color:#BEBEBE;
	height:1.5px;
	margin-top: 2%;
	margin-bottom: 2%;
}

/* 上下标注 */
sup {
	font-size:small;
}
sub {
	font-size:small;
}

/* 标题1 书名 卷 */
h1 {
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	text-indent: 0em;
	text-align:center;
	line-height: 2em;
	margin-top: 30%;
	color: #996699;
	text-shadow: 1px 1px 1px gray;
}

h2 {
	color: #FFFFFF;
	margin-left:25%;
	line-height:200%;
	border-style: none double solid solid;
	border-width: 0px 3px 2px 30px;
	font-weight:bold;
	font-size:large;
	border-color: #FFFFFF;
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	text-shadow: 1px 1px 1px gray;
	padding: 2px 10px 2px 10px;
}
h2.epub {
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	text-indent: 0em;
	font-size: 1.2em;
	text-align: center;
	width: 1em;
	margin: 0em 5% 1.5em;
	line-height: 110%;
	color: #EEEEEE;
	border-style: none double none none;
	border-width: 0px 3px 0px 0px;
	border-color: #EEEEEE;
	padding: 0.5em 10px 0.5em 2px;
	text-shadow: 0px 0px 0px #AAAAAA;
}

h3 {
	margin: 1em 0 5em;
	color: #663366;
	line-height: 120%;
	text-align: left;
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	text-shadow: 1px 1px 1px gray;
	padding: 15px 12px 1em 5px;
	border-style: none none dotted none;
	border-color: #CC6699;
	border-width: 0px 0px 1px 0px;
	text-shadow: 1px 1px 1px #AAAAAA;
}
h3.ebook {
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	text-indent: 0em;
	margin: 1em 0 1em;
	padding: 2px 12px 2px 2px;
	text-align: left;
	line-height: 120%;
	border-style: none none none none;
	text-shadow: 1px 1px 1px #AAAAAA;
}

/* 章节序号 */
.num {
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	background-color: #CC6699;
	border-radius: 2px;
	padding: 4px 0.5em;
	color: #FFF;
	font-size: small;
	text-shadow: 1px 1px 1px #AAAAAA;
}

h4 {
	line-height: 2em;
	text-indent: 0em;
	color: #FFFFFF;
	margin-left:25%;
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	text-shadow: 1px 1px 1px gray;
}

h5 {
	line-height: 1.5em;
	text-indent: 0em;
	color: #FF9900;
	font-size: 14px;
}

.vol {
	padding: 30% 5% 20%;
	margin: 15% -2em 2%;
	background-color: #996699;
	text-indent: 0em;
}
.volbg {
	background-color: #996699;
}

/* 作者译者编者等 */
.author {
	margin: 20% 0;
	text-indent: 0em;
	text-align: center;
	font-size: 1em;
	line-height: 60%;
	font-weight: 600;
	/*color: #;*/
}
.wt {
	text-indent: 0em;
	font-style:italic;
	font-size: 0.9rem;
	line-height: 1.2em;
	color: #336699;
}

/* 出版社 */
.copyright {
	margin: 35% 0 0;
	text-indent: 0em;
	text-align: center;
	font-size: 1em;
	line-height: 120%;
	font-weight: 300;
	/*color: #;*/
}

/* 书票 */
.exL {
	margin: 45% 0;
	text-align: center;
	page-break-before: always;
}
.kh {
	text-indent: 0em;
	text-align: center;
	font-size: 0.80em;
	color: #EEEEEE;
}

/* 电子书信息 */
.info {
	font-size: 1em;
	font-weight: bold;
	line-height: 150%;
	color: #666666;
	margin: 0 0 1em 20%;
}
.info_items {
	font-size: 0.8em;
	line-height: 120%;
	color: #666666;
	margin: 0 0 0 20%;
}
/* 多看 图框 */
.duokan-image-single {
	margin: 0.5em 0;
	bottom: 2%;
	text-align: center;
}

/*++*/
.rht {
	font-family: "微软雅黑","黑体","ht","zw",sans-serif;
	font-size: 115%;
	line-height: 120%;
	text-indent: 0em;
	text-align: right;
	color: #CCCCCC;
}
.lt {
	font-size: 80%;
	text-indent: 0em;
	text-align: right;
	color: #003366;
}
div.float {
	width: 42%;
	float: right;
	margin: 1em 0 0em 1em;
}`;
  },
  container() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
   </rootfiles>
</container>`;
  }
};

function startAndEnd(item) {
  return item.index > 0 && item.index < 6005;
}
