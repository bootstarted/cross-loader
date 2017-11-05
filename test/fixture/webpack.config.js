const path = require('path');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const loader = require.resolve('../../src');
const runtime = path.join(path.dirname(loader), 'runtime.js');

module.exports = function(options) {
  return {
    entry: path.join(
      __dirname,
      options.target === 'node' ? 'index.server.js' : 'index.client.js'
    ),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `${options.target}.js`,
      publicPath: `${options.publicPath}/`,
      libraryTarget: options.target === 'node' ? 'commonjs2' : undefined,
    },
    externals: [
      function(context, request, callback) {
        if (request === `!!${runtime}`) {
          callback(null, `commonjs2 ${runtime}`);
          return;
        }
        callback();
      },
    ],
    module: {
      rules: [{
        test: /\.txt$/,
        use: {
          loader: options.target === 'node' ?
            loader : 'file-loader',
          options: options.target === 'node' ? {
            stats: path.join(__dirname, 'dist', 'stats.json'),
          } : {},
        },
      }],
    },
    plugins: options.target === 'node' ? [] : [
      new StatsWriterPlugin({
        filename: 'stats.json',
        fields: null,
      }),
    ],
  };
};
