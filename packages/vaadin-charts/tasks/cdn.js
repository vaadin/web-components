var gulp = require('gulp');
var config = require('./config.js');

var bower =  require('gulp-bower');
var replace = require('gulp-replace');

var cdnPath = config.dest + '/cdn/vaadin-charts/' + config.version + '/';

gulp.task('cdn:stage', ['cdn:copy-sources', 'cdn:install-dependencies']);

gulp.task('cdn:copy-sources', function() {
    return gulp.src(config.files.src)
        .pipe(replace('../',''))
        .pipe(gulp.dest(cdnPath));
});

gulp.task('cdn:install-dependencies', function() {
    return bower(
        {
            forceLatest: true
        })
        .pipe(gulp.dest(cdnPath));
});
