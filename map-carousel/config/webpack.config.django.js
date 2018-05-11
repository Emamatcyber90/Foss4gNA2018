var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')


module.exports = {
  context: __dirname,
  entry: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      '../src/index'
  ],

  output: {
      path: path.resolve('../../static/webpack_bundles/'),
      filename: '[name]-[hash].js',
      publicPath: 'http://localhost:3000/sustainability/webpack_bundles/', // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    noParse: /(mapbox-gl)\.js$/,
    loaders: [
      // we pass the output from babel loader to react-hot loader
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot-loader/webpack', 'babel-loader?presets[]=react'], },
      { test: /\.css$/, loader: 'css-loader', },
      { test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader" },
    ],
  },

  resolve: {
    modules: ['../node_modules'],
    extensions: ['.js', '.jsx']
  }
}