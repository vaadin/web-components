'use strict';
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var htmlExtract = require('gulp-html-extract');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var typings = require('gulp-typings');

gulp.task('lint:js', function() {
  return gulp.src([
        '*.js',
        'test/*.js'
      ])
      .pipe(jshint())
      .pipe(jshint.reporter())
      .pipe(jshint.reporter('fail'))
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
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
      .pipe(jshint())
      .pipe(jshint.reporter())
      .pipe(jshint.reporter('fail'))
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
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
