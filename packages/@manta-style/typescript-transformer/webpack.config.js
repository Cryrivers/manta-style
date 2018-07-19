module.exports = {
  mode: "production",
  entry: __dirname + "/lib/esm/index.js",
  devtool: "source-map",
  output: {
    path: __dirname + "/lib/cjs",
    filename: "typescript-transformer.js",
    library: "MantaStyleTypeScriptTransformer",
    libraryTarget: "commonjs2"
  },
  externals: {
    typescript: {
      commonjs: 'typescript',
      commonjs2: 'typescript',
      amd: 'typescript'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  }
};
