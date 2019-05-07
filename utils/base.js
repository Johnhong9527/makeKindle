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
          </navPoint>`
          }
        })
        return page
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
      resolve(html)

    })
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
  </html>`
      resolve(html)
    })
  },

  page: function (item, content) {
    return new Promise(resolve => {
      function page(content) {
        let contents = content.split('\n');
        let html = ''
        contents.forEach(key => {
          html += `
          <p>${key}</p>`
        })
        return html
      }
      const html = `
<html  xmlns="http://www.w3.org/1999/xhtml" lang="zh" xml:lang="zh">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<body>
<h3 id="id${item.index}">${content.title}</h3>
${page(content.page)}
</body>
</html>
`;
      resolve(html);
    });
  },
  name: '微微一笑很倾城',
  author: '顾漫',
  uid: '',
  time: ''
};

function startAndEnd(item) {
  return item.index > 0 && item.index < 605;
}
