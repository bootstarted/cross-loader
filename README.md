# cross-loader

Load generated [webpack] modules from another build as if they were your own.

![build status](http://img.shields.io/travis/metalabdesign/cross-loader/master.svg?style=flat)
![coverage](https://img.shields.io/codecov/c/github/metalabdesign/cross-loader/master.svg?style=flat)
![license](http://img.shields.io/npm/l/cross-loader.svg?style=flat)
![version](http://img.shields.io/npm/v/cross-loader.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/cross-loader.svg?style=flat)

```sh
npm install cross-loader
```

You need consistent module ids between the client and server for this to do what it needs to. This means either using `HashedModuleIdsPlugin` or using `NamedModulesPlugin` both of which are consistent.

The client build has things which generate modules you would like to reference on the server – e.g. URLs to images.

```js
var webpack = require('webpack');

module.exports = {
  modules: {
    loaders: [{
      test: /\.(jpg|png)$/,
      loader: 'file-loader',
    }]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new StatsPlugin('stats.json')
  ]
}
```

On the server you can use `cross-loader` to automatically bring in those modules for you assuming your stats were generated with `modules: true` and `source: true`.

```js
var path = require('path');

module.exports = {
  modules: {
    loaders: [{
      test: /\.(jpg|png)$/,
      loader: 'cross-loader',
      query: JSON.stringify({
        stats: path.join('./' 'dist', 'stats.json'),
      }),
    }]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
}

```
