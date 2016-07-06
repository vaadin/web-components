var gulp = require('gulp');
var bower =  require('gulp-bower');
var replace = require('gulp-replace');
var _ = require('lodash');
var rsync = require('gulp-rsync');
var util = require('gulp-util');
var zip = require('gulp-zip');

var config = require('config');

var demoPath = config.dest + '/demo/' + config.version + '/';

var demoUserName = 'demo.username';
var demoHost = 'demo.host';
var demoDestination = 'demo.destination';

gulp.task('demo:war',['demo:stage'], function () {
    gulp.src(["./target/demo/"+config.version+"/**/*"])
        .pipe(zip('vaadin-charts-demo.war'))
        .pipe(gulp.dest("./target/dist"));

});

gulp.task('demo:stage', ['demo:copy-sources','demo:copy-demo' ,'demo:install-dependencies']);

gulp.task('demo:copy-sources', function() {
    return gulp.src(config.files.src)
        .pipe(replace('../',''))
        .pipe(gulp.dest(demoPath));
});

gulp.task('demo:copy-demo', function () {
    return gulp.src(config.files.demo)
        .pipe(replace('../', '', {skipBinary: true}))
        .pipe(gulp.dest(demoPath));
});

gulp.task('demo:install-dependencies', function() {
    return bower(
        {
            forceLatest: true
        })
        .pipe(gulp.dest(demoPath));
});

gulp.task('demo:deploy', ['demo:stage'], function() {
    checkArguments([demoUserName, demoHost, demoDestination]);

    util.log('Publishing demo to ' + config.get(demoUserName) + '@' + config.get(demoHost) + config.get(demoDestination));

    return gulp.src(demoPath)
        .pipe(rsync({
            username: config.get(demoUserName),
            hostname: config.get(demoHost),
            root: demoPath,
            emptyDirectories: false,
            recursive: true,
            clean: true,
            silent: true,
            destination: config.get(demoDestination) + config.version
        }));
});

function checkArguments(arguments) {
    _.forEach(arguments, function(a) {
        if(!config.has(a)) {
            throw Error('Required variable \''+ a +'\'  is missing.');
        }
    });
}
