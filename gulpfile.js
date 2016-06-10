'use strict';

var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
var less = require('gulp-less');
var plugins = require('gulp-load-plugins')();
var path = require('path');
var modRewrite = require('connect-modrewrite');
var serveStatic = require('serve-static');

// Function to clean files using del()
function clean(path) {
	return del.sync(path);
}

// Object with directory paths for further usage
var rootPath = '/docs';

var dirs = {
	source: './src',
	build: './build' + rootPath
};

// Task to compile using metalsmith
gulp.task('metalsmith', function(cb) {
	exec('node index.js ' + rootPath, function(err) {
		if (!err) {
			gulp.src(dirs.build + '/**/*')
				.pipe(plugins.connect.reload())
				.on('end', cb);
		}
	});
})

// Connect task to serve web server and reload automatically
gulp.task('connect', function() {
	plugins.connect.server({
		root: 'build',
		livereload: true,
		port: 8090,
		middleware: function() {
			return [
				modRewrite([
					'^/?$ /docs/ [R]'
				]),
				serveStatic('build', { extensions: ['html'] })
			];
		}
	});
});

// Task to clean/trash folders
gulp.task('clean', function() {
	var files = [
		dirs.source,
		dirs.build
	];

	return clean(files);
});

gulp.task('less', ['metalsmith'], function() {
	return gulp.src('./layouts/styles/main.less')
		.pipe(less({
			paths: './layouts/styles'
		}))
		.pipe(gulp.dest('./build' + rootPath + '/assets'));
});

// Watch for changes in files
gulp.task('watch', function() {
	gulp.watch('./layouts/**/*.less', ['less']);
	gulp.watch('./index.js', ['metalsmith', 'less']);
	gulp.watch(dirs.source + '/**/*', ['metalsmith', 'less']);
	gulp.watch('./plugins/**/*', ['metalsmith', 'less']);
	gulp.watch('./assets/**/*', ['metalsmith', 'less']);
	gulp.watch('./layouts/**/*.html', ['metalsmith', 'less']);
});

// Git clone task to fetch source files from Rocket.Chat.Docs which is also
// dependent on the 'clean' task
gulp.task('git', ['clean'], function(cb) {
	plugins.git.clone('https://github.com/RocketChat/Rocket.Chat.Docs', { args: dirs.source }, function(err) {
		if (err) throw err;
		cb();
	});
});

gulp.task('build', ['git'], function(cb) {
	console.log('git done');
	exec('node index.js ' + rootPath, function(err) {
		cb();
	});
});

gulp.task('build-css', ['build'], function(cb) {
	return gulp.src('./layouts/styles/main.less')
		.pipe(less({
			paths: './layouts/styles'
		}))
		.pipe(gulp.dest('./build' + rootPath + '/assets'));
});

// Register tasks
gulp.task('fetch', ['git']);
gulp.task('default', ['connect', 'metalsmith', 'less', 'watch']);

gulp.task('deploy', ['git', 'build', 'build-css']);
// gulp.task('deploy', ['git', 'build', 'less']);

