var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var Minimist = require('minimist');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, '.');
var DEFAULT_CONTEXT = '/mapreacter';

var plugins = [
  new webpack.ProvidePlugin({
    'Intl': 'imports?this=>global!exports?global.Intl!intl'
  }),

];
var filename = '[name].js';
var devtool= 'inline-source-map';
if (process.env.NODE_ENV === "development") {
  plugins.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('development') } }));
  plugins.push(new ExtractTextPlugin({ filename: 'css/[name].css', disable: false }));
  plugins.push(new ExtractTextPlugin('css/sdk.css'));
  filename = '[name].js';
  devtool = '';

  module.exports = {
    entry: {
      Client: [
          APP_DIR + '/src/client.jsx',
          APP_DIR + '/src/styles/less/client.less',
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
  plugins.push(new ExtractTextPlugin({ filename: 'css/[name].min.css', disable: false }));
  plugins.push(new ExtractTextPlugin('css/sdk.min.css'));
  plugins.push(new HTMLWebpackPlugin({
              filename: 'index.html',
              template: path.resolve(APP_DIR, 'src/tpl/prod.html'),
              inject: 'head',
          }));
  plugins.push(new UglifyJSPlugin({
              uglifyOptions: {
                  sourceMap: true,   // enable source maps to map errors (stack traces) to modules
                  output: {
                    comments: false, // remove all comments
                  },
              }
          }));
  filename = '[name].min.js';
  devtool = '';

  function _resolveBuildContext(defaultContext) {
    // get context command line argument eg: "webpack --context=mapreacter"
    var context = '/' + Minimist(process.argv.slice(2)).context;
    if (!context) {
        console.log('No build context provided, using default target instead\n\n');
        context = defaultContext;
    }
    return context;
  }

  module.exports = {
    entry: {
      Client: [
          APP_DIR + '/src/client.jsx',
          APP_DIR + '/src/styles/less/client.less',
      ],
    },
    output: {
      path: BUILD_DIR,
      filename: filename,
      library: '[name]',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      publicPath: _resolveBuildContext(DEFAULT_CONTEXT)
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
