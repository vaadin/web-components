'use strict';

const gulp = require('gulp');
const sort = require('gulp-sort');
const iconfont = require('gulp-iconfont');
const fs = require('fs');
const svgpath = require('svgpath');
const svgmin = require('gulp-svgmin');

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

function createCopyright() {
  return `/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */`;
}

function createIconset(folder, filenames, idPrefix = '') {
  let output = `<svg xmlns="http://www.w3.org/2000/svg"><defs>\n`;
  filenames.forEach((filename) => {
    // Skip non-svg files
    if (filename.indexOf('.svg') === -1) {
      return;
    }

    const content = fs.readFileSync(folder + filename, 'utf-8');
    const path = content.match(/<path( fill-rule="evenodd" clip-rule="evenodd")* d="([^"]*)"/u);
    if (path) {
      const newPath = new svgpath(path[2])
        .scale(1000 / 24, 1000 / 24)
        .round(0)
        .toString();
      const name = filename.replace('.svg', '').replace(/\s/gu, '-').toLowerCase();
      const attrs = path[1] !== undefined ? path[1] : '';
      output += `<g id="${idPrefix}${name}"><path d="${newPath}"${attrs}></path></g>\n`;
    } else {
      throw new Error(`Unexpected SVG content: ${filename}`);
    }
  });

  output += `</defs></svg>`;
  return output;
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
      // Generate vaadin-iconset
      fs.readdir(folder, (err, filenames) => {
        if (err) {
          console.error(err);
          return;
        }

        filenames.sort(sortIconFilesNormalized);

        const vaadinIcons = `${createCopyright()}
import './version.js';
import { Iconset } from '@vaadin/icon/vaadin-iconset.js';

const template = document.createElement('template');

template.innerHTML = \`${createIconset(folder, filenames, 'lumo:')}\`;

Iconset.register('lumo', 1000, template);\n`;

        fs.writeFile('vaadin-iconset.js', vaadinIcons, (err) => {
          if (err) {
            return console.error(err);
          }
        });
      });

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
            fontName: 'lumo-icons',
            formats: ['woff'],
            fontHeight: 1000,
            ascent: 850,
            descent: 150,
            fixedWidth: true,
            normalize: true,
            timestamp: 1, // Truthy!
          }),
        )
        .on('glyphs', (glyphData) => {
          // Store for later use
          glyphs = glyphData;
        })
        .pipe(gulp.dest('.', { encoding: false }))
        .on('finish', () => {
          // Generate base64 version of the font
          const lumoIconsWoff = fs.readFileSync('lumo-icons.woff');

          const glyphCSSProperties = glyphs.map((g) => {
            const name = g.name.replace(/\s/gu, '-').toLowerCase();
            const unicode = `\\${g.unicode[0].charCodeAt(0).toString(16)}`;
            return `--lumo-icons-${name}: '${unicode}';`;
          });

          // Write the output to src/props/icons.css and font-icons.js
          const outputCSS = `
@font-face {
  font-family: 'lumo-icons';
  src: url(data:application/font-woff;charset=utf-8;base64,${lumoIconsWoff.toString('base64')})
    format('woff');
  font-weight: normal;
  font-style: normal;
}

html {
  ${glyphCSSProperties.join('\n  ')}
}
`;

          fs.writeFile('src/props/icons.css', [createCopyright(), outputCSS.trimStart()].join('\n'), (err) => {
            if (err) {
              return console.error(err);
            }
          });

          const outputJS = `
import './version.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { addLumoGlobalStyles } from './global.js';

const fontIcons = css\`
${outputCSS
  .trim()
  .replace(/\\/gu, '\\\\')
  .replace(/^(?!$)/gmu, '  ')}
\`;

addLumoGlobalStyles('font-icons', fontIcons);
`;

          fs.writeFile('font-icons.js', [createCopyright(), outputJS.trimStart()].join('\n'), (err) => {
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
          fs.unlink('lumo-icons.woff', (err) => {
            if (err) {
              return console.error(err);
            }

            done();
          });
        });
    });
});
