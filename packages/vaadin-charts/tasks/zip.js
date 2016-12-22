var gulp = require('gulp');
var config = require('config');

var bower = require('gulp-bower');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var vulcanize = require('gulp-vulcanize');
var deleteLines = require('gulp-delete-lines');

var zipDest = config.dest + '/zip/';
var zipTemp = config.temp + '/zip/';

gulp.task('zip:stage', ['zip:vulcanize-sources', 'zip:copy-sources', 'zip:copy-demo', 'zip:copy-doc']);

gulp.task('zip:vulcanize-sources', ['zip:copy-sources-temp', 'zip:install-dependencies-temp'], function () {
    return gulp.src(zipTemp+'vaadin-*.html')
        .pipe(vulcanize())
        .pipe(gulp.dest(zipDest));
});

gulp.task('zip:copy-sources', ['zip:copy-sources-temp', 'zip:install-dependencies-temp'], function () {
    return gulp.src(zipTemp + '**/*')
        .pipe(gulp.dest(zipDest + 'src'));
});

gulp.task('zip:copy-sources-temp', function () {
    return gulp.src(config.files.src)
        .pipe(replace('../', ''))
        .pipe(gulp.dest(zipTemp));
});

gulp.task('zip:install-dependencies-temp', function () {
    return bower({forceLatest: true})
        .pipe(gulp.dest(zipTemp));
});

gulp.task('zip:copy-demo', function () {
    return gulp.src(config.files.demo)
        .pipe(replace('../../', '../', {skipBinary: true}))
        .pipe(replace('../', '../src/', {skipBinary: true}))
        .pipe(gulp.dest(zipDest + 'demo'));
});

gulp.task('zip:copy-doc', function () {
    return gulp.src(config.files.doc)
        .pipe(gulp.dest(zipDest))
});
