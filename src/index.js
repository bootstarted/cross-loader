// You need consistent module ids between the client and server for this to do
// what it needs to. This means either using `HashedModuleIdsPlugin` or using
// `NamedModulesPlugin` both of which are consistent.
import loaderUtils from 'loader-utils';

module.exports = function() {
  const options = loaderUtils.getOptions(this);
  const runtime = require.resolve('./runtime');
  const stats = options.stats;

  return `
    var r = require('!!${runtime}');
    r(module.id, ${JSON.stringify(stats)}, function(exports) {
      module.exports = exports;
    });
  `;
};
