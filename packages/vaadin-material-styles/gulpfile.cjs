/* eslint-env node */
'use strict';

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const fs = require('fs');
const svgmin = require('gulp-svgmin');
const sort = require('gulp-sort');

/**
 * Normalize file sort order across platforms (OS X vs Linux, maybe others).
 *
 * Before: `[..., 'eye-disabled', 'eye', ...]`
 * After:  `[..., 'eye', 'eye-disabled', ...]`
 *
 * Order of appearance impacts assigned Unicode codepoints, and sometimes build diffs.
 *
 * @see https://github.com/nfroidure/svgicons2svgfont/pull/82
 * @see https://github.com/nfroidure/svgicons2svgfont/blob/master/src/filesorter.js
 * @see http://support.ecisolutions.com/doc-ddms/help/reportsmenu/ascii_sort_order_chart.htm
 */
function sortIconFilesNormalized(file1, file2) {
  return file1.replace(/-/gu, '~').localeCompare(file2.replace(/-/gu, '~'), 'en-US');
}

gulp.task('icons', (done) => {
  const folder = 'icons/svg/';
  let glyphs;

  // Optimize the source files
  gulp
    .src(`${folder}*.svg`)
    .pipe(
      svgmin({
        plugins: [
          {
            removeTitle: true,
          },
          {
            removeViewBox: false,
          },
          {
            cleanupNumericValues: {
              floatPrecision: 6,
            },
          },
          {
            convertPathData: {
              floatPrecision: 6,
            },
          },
        ],
      }),
    )
    .pipe(gulp.dest(folder))
    .on('finish', () => {
      // Icon font
      gulp
        .src(`${folder}*.svg`)
        .pipe(
          sort({
            comparator(file1, file2) {
              return sortIconFilesNormalized(file1.relative, file2.relative);
            },
          }),
        )
        .pipe(
          iconfont({
            fontName: 'material-icons',
            formats: ['woff'],
            fontHeight: 2400,
            descent: 400,
            normalize: true,
            timestamp: 1, // Truthy!
          }),
        )
        .on('glyphs', (glyphData) => {
          // Store for later use
          glyphs = glyphData;
        })
        .pipe(gulp.dest('.'))
        .on('finish', () => {
          // Generate base64 version of the font
          const materialIconsWoff = fs.readFileSync('material-icons.woff');
          // Write the output to font-icons.js
          let output = `/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './version.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { addMaterialGlobalStyles } from './global.js';

const fontIcons = css\`
  @font-face {
    font-family: 'material-icons';
    src: url(data:application/font-woff;charset=utf-8;base64,${materialIconsWoff.toString('base64')})
      format('woff');
    font-weight: normal;
    font-style: normal;
  }

  html {
`;
          glyphs.forEach((g) => {
            const name = g.name.replace(/\s/gu, '-').toLowerCase();
            const unicode = `\\\\${g.unicode[0].charCodeAt(0).toString(16)}`;
            output += `    --material-icons-${name}: '${unicode}';\n`;
          });
          output += `  }
\`;

addMaterialGlobalStyles('font-icons', fontIcons);
`;
          fs.writeFile('font-icons.js', output, (err) => {
            if (err) {
              return console.error(err);
            }
          });

          const list = glyphs.map((g) => g.name);
          fs.writeFile('test/glyphs.json', JSON.stringify(list, null, 2), (err) => {
            if (err) {
              return console.error(err);
            }
          });

          // Cleanup
          fs.unlink('material-icons.woff', (err) => {
            if (err) {
              return console.error(err);
            }
            done();
          });
        });
    });
});
