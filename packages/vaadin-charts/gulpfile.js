var gulp = require('gulp');
var config = require('./tasks/config.js');
require('./tasks/cdn.js');
require('./tasks/zip.js');
var del = require('del');

var args = require('vargs').argv;

gulp.task('default', function() {
    console.log('\n  Use:\n    gulp <clean | stage>\n');
});

gulp.task('clean', ['clean:staging']);

gulp.task('clean:staging', function(done){
    del([config.dest + '/**/*'], done);
});

gulp.task('stage', ['clean', 'cdn:stage', 'zip:stage']);
