/* eslint-env node */
'use strict';

const gulp = require('gulp');
const modify = require('gulp-modify');
const cheerio = require('cheerio');
const concat = require('gulp-concat');

gulp.task('icons', function () {
  return gulp
    .src(['assets/svg/*.svg'], { base: '.' })
    .pipe(
      modify({
        fileModifier: function (file, contents) {
          var id = file.path.replace(/.*\/(.*).svg/, '$1');
          var svg = cheerio.load(contents, { xmlMode: true })('svg');
          // Remove fill attributes.
          svg.children('[fill]').removeAttr('fill');
          // Add closing tags instead of self-closing.
          const content = svg.children().toString().replace(/"\/>/g, '"></path>');
          // Output the "meat" of the SVG as group element.
          return `<g id="${id}">${content}</g>`;
        }
      })
    )
    .pipe(concat('iconset.js'))
    .pipe(
      modify({
        fileModifier: function (file, contents) {
          // Enclose all icons in an iron-iconset-svg
          return (
            `/**
 * @license
 * Copyright (c) 2015 - 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = \`<iron-iconset-svg name="vaadin" size="16">
<svg><defs>
` +
            contents +
            `
</defs></svg>
</iron-iconset-svg>\`;

document.head.appendChild($_documentContainer.content);\n`
          );
        }
      })
    )
    .pipe(gulp.dest('.'));
});
