'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var htmlExtract = require('gulp-html-extract');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var typings = require('gulp-typings');

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
    sel: 'script, code-example code'
  }))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('typings', function() {
  return gulp.src('test/angular2/typings.json')
    .pipe(typings());
});

gulp.task('ng2', ['typings'], function() {
  ['test/angular2'].forEach(function(dir) {
    gulp.src([dir + '/*.ts', 'test/angular2/typings/main/**/*.d.ts'])
      .pipe(sourcemaps.init())
      .pipe(ts(ts.createProject('test/angular2/tsconfig.json')))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dir));
  });
});

gulp.task('ng2:watch', function() {
  gulp.watch('test/angular2/*.ts', ['ng2']);
});
