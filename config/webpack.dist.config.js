var webpack = require('webpack');
var path = require('path');
var defaultSettings = require('./defaults');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var filePath = defaultSettings.filePath;
var precss = require('precss');
var autoprefixer = require('autoprefixer');

// Create multiple instances
const extractCSS = new ExtractTextPlugin('[name].[hash].css');
const extractSASS = new ExtractTextPlugin('[name].[hash].css');

var webpackConfig = {
  entry: {
    common: ['react', 'react-dom', 'jquery', 'babel-polyfill']
  },
  output: {
    path: filePath.build,
    filename: '[name].[hash].js',
    publicPath: '/build/'
  },
  cache: false,
  devtool: false,
  // 定义路径及文件的别名（方便书写）
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'components': path.join(__dirname, '../src/javascript/components'),
      'extend': path.join(__dirname, '../src/javascript/extend'),
      'constants': path.join(__dirname, '../src/javascript/extend/constants'),
      'page': path.join(__dirname, '../src/javascript/page'),
      'scss': path.join(__dirname, '../src/scss'),
      'states': path.join(__dirname, '../src/javascript/states'),
      'pages': path.join(__dirname, '../src/newPages'),
      'images': path.join(__dirname, '../res/images'),
      'data': path.join(__dirname, '../src/javascript/data'),
      'fonts': path.join(__dirname, '../res/fonts'),
      'jquery': path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')
    }
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      use: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=stage-1',
      exclude: /node_modules/
    }, {
      test: /\.scss/,
      use: extractSASS.extract([
        'css-loader',
        'postcss-loader',
        'sass-loader?outputStyle=compressed'
      ]),
    }, {
      test: /\.css$/,
      use: extractCSS.extract([
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]),
    }, {
      test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
      use: 'url-loader?limit=1&name=res/[name].[hash].[ext]'
    }, {
      test: /\.json$/,
      use: 'json-loader'
    }]
  },
  // CSS预处理 FIXME
  // postcss: function() {
  //   return [precss, autoprefixer];
  // },
  // 插件
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      filename: "common.[hash].js",
      chunks: defaultSettings.chunks
    }),
    extractSASS,
    extractCSS,
    // new ExtractTextPlugin('[name].[hash].css'),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
      output: {
        comments: false
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};

function injectEntry() {
  defaultSettings.pagesToPath().forEach(function(item) {
    webpackConfig.entry[item.name] = item.entry;
  });
}

function injectHtmlWebpack() {
  defaultSettings.pagesToPath().forEach(function(item) {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: item.ftl,
        template: item.templates,
        chunks: ['common', item.name],
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: false
        }
      })
    );
  });
}

// 为单个页面配置个性化信息
(function() {
  injectEntry();
  injectHtmlWebpack();
})();

module.exports = webpackConfig;