var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');
var config = require('config');

var demoFiles = [config.files.demo, "!/**/valo/**/*", "!/**/base/**/*", "!/**/img/**/*"];

gulp.task('format:verify', ['format:verify:src', 'format:verify:demo', 'format:verify:test']);

gulp.task('format:verify:src', function() {
    gulp.src(config.files.src)
        .pipe(prettify({config: 'config/jsbeautifyrc.json', mode: 'VERIFY_ONLY'}));
});

gulp.task('format:verify:demo', function() {

    gulp.src(demoFiles)
        .pipe(prettify({config: 'config/jsbeautifyrc.json', mode: 'VERIFY_ONLY'}));
});

gulp.task('format:verify:test', function() {
    gulp.src(config.files.test)
        .pipe(prettify({config: 'config/jsbeautifyrc.json', mode: 'VERIFY_ONLY'}));
});

gulp.task('format',['format:src', 'format:demo', 'format:test']);

gulp.task('format:src', function() {
    gulp.src(config.files.src)
        .pipe(prettify({config: 'config/jsbeautifyrc.json', mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest("."));
});

gulp.task('format:demo', function() {
    gulp.src(demoFiles)
        .pipe(prettify({config: 'config/jsbeautifyrc.json', mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest("./demo/"));
});

gulp.task('format:test', function() {
    gulp.src(config.files.test)
        .pipe(prettify({config: 'config/jsbeautifyrc.json', mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest("./test/"));
});
