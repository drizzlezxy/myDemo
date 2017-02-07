var gulp = require('gulp');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var webpackDevServer = require('webpack-dev-server');
var open = require('open');
var del = require('del');
var webpackDevConfig = require('./config/webpack.config.js');
var webpackDistConfig = require('./config/webpack.dist.config.js');
var defaultSettings = require('./config/defaults.js');
var filePath = defaultSettings.filePath;


gulp.task('default', ['dev']);

gulp.task('dev', function() {
	var compiler = webpack(webpackDevConfig);
	new webpackDevServer(compiler, {
		contentBase: './',
		historyApiFallback: true,
		hot: true,
		noInfo: false,
		publicPath: filePath.publicPath
	}).listen(defaultSettings.port, function(err) {
		console.log('\n|=============================================|\n');
		console.log('    listening: http://localhost:' + defaultSettings.port + '\n');
		console.log('    Opening your system browser...\n');
		console.log('|=============================================|\n');
		open('http://localhost:' + defaultSettings.port + '/webpack-dev-server/newPages/Test/index.html');
	})
})

gulp.task('clean', function(cb) {
	return del(['build/**/*'], cb)
})

gulp.task('build', ['clean'], function() {
	return gulp.src(filePath.srcPath)
		.pipe(gulpWebpack(webpackDistConfig, webpack))
		.pipe(gulp.dest('./build'));
})