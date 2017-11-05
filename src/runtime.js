const load = typeof __non_webpack_require__ !== 'undefined' ?
  __non_webpack_require__ : require;
const vm = load('vm');
const fs = load('fs');
const cache = {};

function getSource(stats, id) {
  for (let i = 0; i < stats.modules.length; ++i) {
    if (stats.modules[i].id === id) {
      return stats.modules[i].source;
    }
  }
  return '';
}

module.exports = function(target, path, fn) {
  function update(stats) {
    const source = getSource(stats, target);
    const fakeModule = {exports: {}};
    const sandbox = vm.createContext({
      __webpack_public_path__: stats.publicPath,
      module: fakeModule,
      exports: fakeModule.exports,
    });
    vm.runInContext(source, sandbox);
    fn(fakeModule.exports);
  }

  if (typeof __webpack_dev_token__ !== 'undefined') {
    const watch = load('webpack-udev-server/watch').default;
    const watcher = watch(path);
    watcher.observe(update);
  } else {
    if (!cache[path]) {
      cache[path] = JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    update(cache[path]);
  }
};
