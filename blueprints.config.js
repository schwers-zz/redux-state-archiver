module.exports = [{
  name: 'redux-state-archiver',
  webpack: {
    devtool: 'source-map',
    entry: './src/StateArchiver.es6.js',
    output: {
      generator: 'umd',
      dest: './bin',
    },
    resolve: {
      generator: 'npm-and-modules',
      extensions: ['', '.js', '.jsx', '.es6.js', '.json'],
    },
    loaders: [
      'esnextreact',
      'json',
    ],
    plugins: [
      'production-loaders',
      'set-node-env',
      'abort-if-errors',
      'minify-and-treeshake',
    ],
    externals: {
      'js-cookie': 'commonjs js-cookie',
      react: 'commonjs react',
      'react-dom': 'commonjs react-dom',
      'react-redux': 'commonjs react-redux',
      redux: 'commonjs redux',
      reselect: 'commonjs reselect',
      lodash: 'lodash',
    },
  },
}];
