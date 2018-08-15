module.exports = {
  mode: 'production',
  entry: __dirname + '/lib/esm/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib/cjs',
    filename: 'flow-transformer.js',
    library: 'MantaStyleFlowTransformer',
    libraryTarget: 'commonjs2',
  },
  externals: {
    'babel-core': {
      commonjs: 'babel-core',
      commonjs2: 'babel-core',
      amd: 'babel-core',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
};
