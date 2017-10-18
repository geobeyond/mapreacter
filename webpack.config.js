var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, '.');

var plugins = [
  new webpack.ProvidePlugin({
    'Intl': 'imports?this=>global!exports?global.Intl!intl'
  }),

];
var filename = '[name].js';
var devtool= 'inline-source-map';
if (process.env.NODE_ENV === "development") {
  plugins.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('development') } }));
  plugins.push(new ExtractTextPlugin({ filename: 'css/app.css', disable: false }));
  plugins.push(new ExtractTextPlugin('css/sdk.css'));
  filename = '[name].js';
  devtool = '';

  module.exports = {
    entry: {
      app: [
          APP_DIR + '/src/app.js',
          APP_DIR + '/src/styles/less/app.less',
      ],
    },
    output: {
      path: BUILD_DIR,
      filename: filename,
      library: '[name]',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      publicPath: "/dist/"
    },
    devtool: devtool,
    node: {fs: "empty"},
    plugins: plugins,
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        }, {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', {
            loader: 'less-loader',
            }],
          }),
        }, {
          test: /\.json$/,
          loader: "json-loader"
        }, {
          test: /\.(png|gif|jpg|jpeg|svg|otf|ttf|eot|woff)$/,
          loader: 'file-loader'
        }, {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules'],
            }
            }],
          }),
        }
      ],
      noParse: [/dist\/ol.js/, /dist\/jspdf.debug.js/]
    },
    externals: {
      'cheerio': 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    }
  };
}
if (process.env.NODE_ENV === "production") {
  plugins.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }));
  plugins.push(new ExtractTextPlugin({ filename: 'css/app.min.css', disable: false }));
  plugins.push(new ExtractTextPlugin('css/sdk.min.css'));
  filename = '[name].min.js';
  devtool = '';

  module.exports = {
    entry: {
      app: [
          APP_DIR + '/src/app.js',
          APP_DIR + '/src/styles/less/app.less',
      ],
    },
    output: {
      path: BUILD_DIR,
      filename: filename,
      library: '[name]',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      publicPath: "/dist/"
    },
    devtool: devtool,
    node: {fs: "empty"},
    plugins: plugins,
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        }, {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', {
            loader: 'less-loader',
            }],
          }),
        }, {
          test: /\.json$/,
          loader: "json-loader"
        }, {
          test: /\.(png|gif|jpg|jpeg|svg|otf|ttf|eot|woff)$/,
          loader: 'file-loader'
        }, {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules'],
            }
            }],
          }),
        }
      ],
      noParse: [/dist\/ol.js/, /dist\/jspdf.debug.js/]
    },
    externals: {
      'cheerio': 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    }
  };
}
