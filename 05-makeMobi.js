const shell = require('shelljs');
const utils = require('./utils/base');
shell.exec(`zip -p -r ${utils.name}.epub book`);
// shell.exec(`./utils/kindlegen -c1 ${utils.name}.epub -locale zh`);
// shell.exec(`rm ${utils.name}.epub`);