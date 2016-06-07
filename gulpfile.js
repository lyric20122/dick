'use strict';

var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// Function to clean files using del()
function clean(path) {
  return del(path);
}

// Object with directory paths for further usage
var dirs = {
  source: './src',
  build: './build'
};

// Task to compile using metalsmith
gulp.task('metalsmith', function (cb) {
  exec('node index.js', function (err) {
    if (!err) {
      gulp.src(dirs.build+'/**/*')
        .pipe(plugins.connect.reload());
    }
    cb(err);
  });
})

// Connect task to serve web server and reload automatically
gulp.task('connect', function() {
  plugins.connect.server({
    root: 'build',
    livereload: true,
    port: 8090
  });
});

// Task to clean/trash folders
gulp.task('clean', function () {
  var files = [
    dirs.source,
    dirs.build
  ];

  return clean(files);
});

// Watch for changes in files
gulp.task('watch', function() {
  gulp.watch(dirs.source + '/**/*', ['metalsmith']);
  gulp.watch('./assets/**/*', ['metalsmith']);
  gulp.watch('./templates/**/*', ['metalsmith']);
 });

// Git clone task to fetch source files from Rocket.Chat.Docs which is also
// dependent on the 'clean' task
gulp.task('git', ['clean'], function(){
  plugins.git.clone('https://github.com/RocketChat/Rocket.Chat.Docs', { args: dirs.source }, function (err) {
    if (err) throw err;
  });
});

// Register tasks
gulp.task('fetch', ['git']);
gulp.task('default', ['connect', 'metalsmith', 'watch']);
