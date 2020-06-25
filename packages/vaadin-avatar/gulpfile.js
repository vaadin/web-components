'use strict';

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const exec = require('child_process').exec;
const fs = require('fs');

gulp.task('icons', function(done) {
  const fontName = 'vaadin-avatar-icons';
  const fileName = 'vaadin-avatar-icons';

  gulp.src('icons/*.svg')
    .pipe(iconfont({
      fontName: fileName,
      formats: ['woff'],
      fontHeight: 1000,
      ascent: 850,
      descent: 150,
      fixedWidth: true,
      normalize: true,
    }))
    .pipe(gulp.dest('.'))
    .on('finish', function() {
      // Generate base64 version of the font
      exec(`base64 ${fileName}.woff`, function(err, stdout) {
        var output = `<!-- NOTE: Auto generated with 'gulp icons', do not edit -->
<link rel="import" href="../../polymer/lib/elements/custom-style.html">

<custom-style>
  <style>
    @font-face {
      font-family: '${fontName}';
      src: url(data:application/font-woff;charset=utf-8;base64,${stdout.trim()}) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
</custom-style>
`;
        fs.writeFile(`src/${fileName}.html`, output, function(err) {
          if (err) {
            return console.error(err);
          }
        });

        // Cleanup
        fs.unlink(`${fileName}.woff`, function(err) {
          if (err) {
            return console.error(err);
          }
          done();
        });
      });
    });
});
