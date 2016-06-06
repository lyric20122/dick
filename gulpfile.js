'use strict';

var del = require('del');
var exec = require('child_process').exec;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

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
    cb(err);
  });
})

// Connect task to serve web server and reload automatically
gulp.task('connect', function() {
  $.connect.server({
    root: 'build',
    livereload: true
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

// Git clone task to fetch source files from Rocket.Chat.Docs which is also
// dependent on the 'clean' task
gulp.task('git', ['clean'], function(){
  $.git.clone('https://github.com/RocketChat/Rocket.Chat.Docs', { args: dirs.source }, function (err) {
    if (err) throw err;
  });
});

// Register tasks
gulp.task('fetch', ['git']);
gulp.task('default', ['connect', 'metalsmith']);
