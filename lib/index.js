
var Plugin = require('jack-stack').Plugin;

module.exports = new Plugin({
  name: 'auth/stormpath',
  basePath: __dirname,
  dependencies: [ 'db/couch', ],
});
