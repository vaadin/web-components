'use strict';

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const exec = require('child_process').exec;
const fs = require('fs');

gulp.task('icons', function(done) {
  var glyphs;
  const fontName = 'vaadin-rte-icons';
  const fileName = 'vaadin-rich-text-editor-icons';

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
    .on('glyphs', function(glyphData) {
      // Store for later use
      glyphs = glyphData;
    })
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

    html {
`;
        glyphs.forEach(g => {
          var name = g.name.replace(/\s/g, '-').toLowerCase();
          var unicode = '\\' + g.unicode[0].charCodeAt(0).toString(16);
          output += `      --${fontName}-${name}: "${unicode}";\n`;
        });
        output += `    }
  </style>
</custom-style>

<dom-module id="${fileName}">
  <template>
    <style>
`;
        glyphs.forEach((g, index) => {
          var name = g.name.replace(/\s/g, '-').toLowerCase();
          output += `      [part~="toolbar-button-${name}"]::before {
        content: var(--${fontName}-${name});
      }`;
          if (index < glyphs.length - 1) {
            output += `

`;
          }
        });
        output += `
    </style>
  </template>
</dom-module>
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
