'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var htmlExtract = require('gulp-html-extract');

gulp.task('lint', ['lint:js', 'lint:html']);

gulp.task('lint:js', function() {
  return gulp.src([
    '*.js',
    'test/*.js'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('lint:html', function() {
  return gulp.src([
    '*.html',
    'demo/*.html',
    'test/*.html'
  ])
  .pipe(htmlExtract({
    sel: 'script, code-example code',
    strip: true
  }))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});
