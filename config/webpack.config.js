var webpack = require('webpack');
var path = require('path');
var defaultSettings = require('./defaults');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var filePath = defaultSettings.filePath;
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var webpackConfig = {
  entry: {},
  output: {
    path: filePath.devbuild,
    filename: '[name].js',
    publicPath: filePath.publicPath //FIXME
  },
  cache: true,
  devtool: 'inline-source-map',
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
      'font': path.join(__dirname, '../res/font'),
      'jquery': path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')
    }
  },
  module: {
    // 排除项 FIXME
    // noParse: [
    //   path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')
    // ],
    // 加载器
    loaders: [{
      test: /.jsx?$/,
      loaders: ['react-hot-loader', 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=stage-1', 'webpack-module-hot-accept'],
      exclude: /node_modules/
    }, {
      test: /\.scss/,
      loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=compressed',
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader',
    }, {
      test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=1&name=res/[name].[hash:8].[ext]'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  // CSS预处理 FIXME
  // postcss: function() {
  //   return [precss, autoprefixer];
  // },
  // 插件
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'),
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
    /*  item
     *  {
     *    name: 'Test/index',
     *    entry: 'page/' + 'Test/index.jsx',
     *    ftl: 'newPages/Test/index.html',
     *    templates: path.join(filePath.tplPath, 'newPages/Test/index.html')
     *  }
     */
    webpackConfig.entry[item.name] = [
      'webpack-dev-server/client?http://localhost:' + defaultSettings.port,
      'webpack/hot/only-dev-server',
      item.entry
    ];
  });
}

function injectHtmlWebpack() {
  defaultSettings.pagesToPath().forEach(function(item) {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename: item.ftl,
        template: item.templates,
        chunks: [item.name],
        inject: true
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