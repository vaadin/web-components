'use strict';
var gulp = require('gulp');
var config = require('config');
require('./tasks/cdn.js');
require('./tasks/demo.js');
require('./tasks/zip.js');
var del = require('del');

gulp.task('default', function() {
    console.log('\n  Usage:\n    gulp <clean | [cdn:demo:zip:]stage | [cdn:demo:]deploy>\n');
});

gulp.task('clean', ['clean:staging']);

gulp.task('clean:staging', function(done){
    del([config.dest + '/**/*'], done);
});

gulp.task('stage', ['cdn:stage', 'zip:stage']);

gulp.task('deploy', ['cdn:deploy']);
