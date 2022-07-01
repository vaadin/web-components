/* eslint-env node */
'use strict';

const gulp = require('gulp');
const modify = require('gulp-modify');
const cheerio = require('cheerio');
const concat = require('gulp-concat');

function createCopyright() {
  return `/**
 * @license
 * Copyright (c) 2015 - ${new Date().getFullYear()} Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */`;
}

function iconFileModifier(prefix) {
  return function (file, contents) {
    const id = file.path.replace(/.*\/(.*).svg/, '$1');
    const svg = cheerio.load(contents, { xmlMode: true })('svg');
    // Remove fill attributes.
    svg.children('[fill]').removeAttr('fill');
    // Add closing tags instead of self-closing.
    const content = svg.children().toString().replace(/"\/>/g, '"></path>');
    // Output the "meat" of the SVG as group element.
    return `<g id="${prefix}${id}">${content}</g>`;
  };
}

gulp.task('iron-icons', () => {
  return gulp
    .src(['assets/svg/*.svg'], { base: '.' })
    .pipe(
      modify({
        fileModifier: iconFileModifier(''),
      }),
    )
    .pipe(concat('iconset.js'))
    .pipe(
      modify({
        fileModifier(file, contents) {
          // Enclose all icons in an iron-iconset-svg
          return `${createCopyright()}
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

const template = document.createElement('template');

template.innerHTML = \`<iron-iconset-svg name="vaadin" size="16">
<svg><defs>\n${contents}\n</defs></svg>
</iron-iconset-svg>\`;

document.head.appendChild(template.content);\n`;
        },
      }),
    )
    .pipe(gulp.dest('.'));
});

gulp.task('vaadin-icons', () => {
  return gulp
    .src(['assets/svg/*.svg'], { base: '.' })
    .pipe(
      modify({
        fileModifier: iconFileModifier('vaadin:'),
      }),
    )
    .pipe(concat('vaadin-iconset.js'))
    .pipe(
      modify({
        fileModifier(file, contents) {
          // Enclose all icons in a vaadin-iconset
          return `${createCopyright()}
import '@vaadin/icon/vaadin-iconset.js';
import '@vaadin/icon/vaadin-icon.js';

const template = document.createElement('template');

template.innerHTML = \`<vaadin-iconset name="vaadin" size="16">
<svg><defs>\n${contents}\n</defs></svg>
</vaadin-iconset>\`;

document.head.appendChild(template.content);\n`;
        },
      }),
    )
    .pipe(gulp.dest('.'));
});

gulp.task('icons', gulp.parallel('iron-icons', 'vaadin-icons'));
