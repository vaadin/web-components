var gulp = require('gulp');
var bower =  require('gulp-bower');
var replace = require('gulp-replace');
var _ = require('lodash');
var rsync = require('gulp-rsync');
var util = require('gulp-util');

var config = require('config');

var cdnPath = config.dest + '/cdn/vaadin-charts/' + config.version + '/';

var cdnUserName = 'cdn.username';
var cdnHost = 'cdn.host';
var cdnDestination = 'cdn.destination';

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
    checkArguments([cdnUserName, cdnHost, cdnDestination]);

    util.log('Publishing to CDN ' + config.get(cdnUserName) + '@' + config.get(cdnHost) + config.get(cdnDestination));

    return gulp.src(cdnPath)
        .pipe(rsync({
            username: config.get(cdnUserName),
            hostname: config.get(cdnHost),
            root: cdnPath,
            emptyDirectories: false,
            recursive: true,
            clean: true,
            silent: true,
            destination: config.get(cdnDestination) + config.version
        }));
});

function checkArguments(arguments) {
    _.forEach(arguments, function(a) {
        if(!config.has(a)) {
            throw Error('Required variable \''+ a +'\'  is missing.');
        }
    });
}
