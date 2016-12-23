'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var htmlExtract = require('gulp-html-extract');
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
  .pipe(eslint.failAfterError('fail'));
});

gulp.task('lint:html', function() {
  return gulp.src([
    '*.html',
    'demo/*.html',
    'test/*.html',
    '!demo/x-data-source.html'
  ])
  .pipe(htmlExtract({
    sel: 'script, code-example code'
  }))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError('fail'));
});

gulp.task('gwt', ['gwt:copy']);

gulp.task('test', ['gwt:validate', 'test:local']);

gulp.task('typings', function() {
  return gulp.src('directives/typings.json')
    .pipe(typings());
});

gulp.task('ng2', ['typings'], function() {
  ['directives', 'test/angular2'].forEach(function(dir) {
    gulp.src([dir + '/*.ts', 'directives/typings/main/**/*.d.ts'])
      .pipe(sourcemaps.init())
      .pipe(ts(ts.createProject('directives/tsconfig.json')))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dir));
  });
});

gulp.task('ng2:watch', function() {
  gulp.watch('directives/*.ts', ['ng2']);
  gulp.watch('test/angular2/*.ts', ['ng2']);
});
