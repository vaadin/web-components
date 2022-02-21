import { readFile } from 'fs/promises';
import { posix as path } from 'path';
import { default as ModuleFederationPlugin } from 'webpack/lib/container/ModuleFederationPlugin.js';
import { BundleJson } from './src/lib/bundle-json';

// Use the modules from the workspace root
const modulesDirectory = '../../node_modules';

const bundleJson: BundleJson = JSON.parse(await readFile('vaadin-bundle.json', { encoding: 'utf8' }));
const exposes = Object.entries(bundleJson.packages)
  .flatMap(([packageName, packageInfo]) =>
    Object.keys(packageInfo.exposes).map((modulePath) => `${packageName}${modulePath.substring(1)}`)
  )
  .reduce<Record<string, string>>((exposes, moduleSpecifier) => {
    exposes[`./node_modules/${moduleSpecifier}`] = path.posix.join(modulesDirectory, moduleSpecifier);
    return exposes;
  }, {});

export default {
  mode: 'development',
  entry: {
    vaadin: './src/vaadin.js'
  },
  resolve: {
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  devtool: 'source-map',
  experiments: {
    outputModule: true
  },
  output: {
    path: path.resolve(''),
    filename: '[name].js',
    library: {
      type: 'module'
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'vaadin',
      library: {
        type: 'module'
      },
      exposes
    })
  ]
};
