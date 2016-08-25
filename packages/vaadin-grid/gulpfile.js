'use strict';
var gulp = require('gulp');
require('require-dir')('./tasks');
var common = require('./tasks/common');
require('web-component-tester').gulp.init(gulp);
var args = require('yargs').argv;
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var typings = require('gulp-typings');

gulp.task('default', function() {
  console.log('\n  Use:\n    gulp <clean|gwt[ --gwt-pretty]|test[:validation:sauce]>\n');
});

gulp.task('gwt', ['gwt:copy']);

gulp.task('test', ['gwt:validate', 'test:local']);

gulp.task('test:desktop', function(done) {
  common.testSauce(
    [],
    ['Windows 10/chrome@45',
      'Windows 10/firefox@41',
      'Windows 10/internet explorer@11',
      //'Windows 10/microsoftedge@20',
      'OS X 10.10/safari@8.0'],
    'vaadin-grid',
     done);
});

gulp.task('test:mobile', function(done) {
  common.testSauce(
    [],
    ['OS X 10.11/iphone@9.3',
      'Linux/android@5.1'],
    'vaadin-grid',
    done);
});

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
