
var config = require('config');

var data = {
  restful: false,
  callNext: false,
  passport: false,

  expansions: 'customData,groups,directory',
};

if (config.has('stormpath')) {
  var stormpath = config.get('stormpath');

  data.apiKeyId = stormpath.apiKeyId;
  data.apiKeySecret = stormpath.apiKeySecret;
  data.appHref = stormpath.appHref;
}


module.exports = data;
