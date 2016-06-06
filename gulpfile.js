'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// Connect task to serve web and reload automatically
gulp.task('connect', function() {
  $.connect.server({
    root: 'build',
    livereload: true
  });
});

// Register default task
gulp.task('default', ['connect']);
