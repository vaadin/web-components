var gulp = require('gulp');
var config = require('./config.js');

var bower =  require('gulp-bower');
var replace = require('gulp-replace');
var args = require('yargs').argv;
var _ = require('lodash');
var rsync = require('gulp-rsync');

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

gulp.task('cdn:deploy', ['cdn:stage'], function() {
    checkArguments(['cdnUsername', 'cdnDestination','cdnHost']);

    return gulp.src(cdnPath)
        .pipe(rsync({
            username: args.cdnUsername,
            hostname: args.cdnHost,
            root: cdnPath,
            emptyDirectories: false,
            recursive: true,
            clean: true,
            silent: true,
            destination: args.cdnDestination + config.version
        }));
});

function checkArguments(arguments) {
    _.forEach(arguments, function(a) {
        if(!args.hasOwnProperty(a)) {
            throw Error('Required argument \'--'+ a +'\' is missing.');
        }
    });
}
