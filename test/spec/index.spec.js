import webpack from 'webpack';
import createConfig from '../fixture/webpack.config';
import path from 'path';
import vm from 'vm';
import fs from 'fs';
import {expect} from 'chai';

const execWebpack = (config) => {
  const compiler = webpack(config);
  return new Promise((resolve) => {
    compiler.run((err, _stats) => {
      expect(err).to.be.null;
      const data = {};
      const sandbox = vm.createContext(data);
      const bin = path.join(config.output.path, config.output.filename);
      const code = fs.readFileSync(bin, 'utf8');
      sandbox.require = require;
      sandbox.module = {};
      vm.runInContext(code, sandbox);
      resolve(sandbox);
    });
  });
};

describe('cross-loader', () => {
  it('should work with client being built first', () => {
    const serverConfig = createConfig({
      target: 'node',
    });
    const clientConfig = createConfig({
      target: 'web',
      publicPath: '/derp',
    });
    return execWebpack(clientConfig).then(() => {
      return execWebpack(serverConfig).then((result) => {
        expect(result.module).to.have.property('exports').to.contain('/derp');
      });
    });
  });
});
