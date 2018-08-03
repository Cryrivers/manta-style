module.exports = {
  mode: 'production',
  entry: __dirname + '/lib/esm/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib/umd',
    filename: 'manta-style.js',
    library: 'MantaStyle',
    libraryTarget: 'umd',
    // See https://github.com/webpack/webpack/issues/6522
    globalObject: "typeof self !== 'undefined' ? self : this",
    umdNamedDefine: true,
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
  performance: {
    hints: false,
  },
};
