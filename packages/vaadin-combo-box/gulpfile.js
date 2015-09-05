'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('demo', function () {
  browserSync({
    port: 5000,
    ghostMode: false,

    server: {
      baseDir: ['.','demo'],
      routes: {
        '': 'bower_components'
      }
    }
  });

  gulp.watch(['./*'], reload);
  gulp.watch(['./demo/*'], reload);
});
