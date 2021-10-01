/* eslint-env node */
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
  return file1.replace(/-/g, '~').localeCompare(file2.replace(/-/g, '~'), 'en-US');
}

function createCopyright() {
  return `/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */`;
}

function createIconset(folder, filenames, idPrefix = '') {
  let output = `<svg xmlns="http://www.w3.org/2000/svg">\n<defs>\n`;
  filenames.forEach(function (filename) {
    // Skip non-svg files
    if (filename.indexOf('.svg') === -1) {
      return;
    }

    const content = fs.readFileSync(folder + filename, 'utf-8');
    const path = content.match(/<path( fill-rule="evenodd" clip-rule="evenodd")* d="([^"]*)"/);
    if (path) {
      const newPath = new svgpath(path[2])
        .scale(1000 / 24, 1000 / 24)
        .round(0)
        .toString();
      const name = filename.replace('.svg', '').replace(/\s/g, '-').toLowerCase();
      const attrs = path[1] !== undefined ? path[1] : '';
      output += `<g id="${idPrefix}${name}"><path d="${newPath}"${attrs}></path></g>\n`;
    } else {
      throw new Error(`Unexpected SVG content: ${filename}`);
    }
  });

  output += `</defs>\n</svg>`;
  return output;
}

gulp.task('icons', async function () {
  const folder = 'icons/svg/';
  let glyphs;

  // Optimize the source files
  gulp
    .src(folder + '*.svg')
    .pipe(
      svgmin({
        plugins: [
          {
            removeTitle: true
          },
          {
            removeViewBox: false
          },
          {
            cleanupNumericValues: {
              floatPrecision: 6
            }
          },
          {
            convertPathData: {
              floatPrecision: 6
            }
          }
        ]
      })
    )
    .pipe(gulp.dest(folder))
    .on('finish', function () {
      // iron-iconset-svg
      fs.readdir(folder, function (err, filenames) {
        if (err) {
          console.error(err);
          return;
        }

        filenames.sort(sortIconFilesNormalized);

        const ironIcons = `${createCopyright()}
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import './version.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = \`<iron-iconset-svg size="1000" name="lumo">
${createIconset(folder, filenames)}
</iron-iconset-svg>\`;\n\ndocument.head.appendChild($_documentContainer.content);\n`;

        fs.writeFile('iconset.js', ironIcons, function (err) {
          if (err) {
            return console.error(err);
          }
        });

        const vaadinIcons = `${createCopyright()}
import '@vaadin/icon/vaadin-iconset.js';
import './version.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = \`<vaadin-iconset name="lumo" size="1000">
${createIconset(folder, filenames, 'lumo:')}
</vaadin-iconset>\`;\n\ndocument.head.appendChild($_documentContainer.content);\n`;

        fs.writeFile('vaadin-iconset.js', vaadinIcons, function (err) {
          if (err) {
            return console.error(err);
          }
        });
      });

      // icon font
      gulp
        .src(folder + '*.svg')
        .pipe(
          sort({
            comparator: function (file1, file2) {
              return sortIconFilesNormalized(file1.relative, file2.relative);
            }
          })
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
            timestamp: 1 // Truthy!
          })
        )
        .on('glyphs', function (glyphData) {
          // Store for later use
          glyphs = glyphData;
        })
        .pipe(gulp.dest('.'))
        .on('finish', function () {
          // Generate base64 version of the font
          const lumoIconsWoff = fs.readFileSync('lumo-icons.woff');

          // Write the output to font-icons.js
          let output = createCopyright();
          output += `
import './version.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = \`
  <style>
    @font-face {
      font-family: 'lumo-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,${lumoIconsWoff.toString('base64')}) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
`;
          glyphs.forEach((g) => {
            const name = g.name.replace(/\s/g, '-').toLowerCase();
            const unicode = '\\\\' + g.unicode[0].charCodeAt(0).toString(16);
            output += `      --lumo-icons-${name}: "${unicode}";\n`;
          });
          output += `    }
  </style>
\`;

document.head.appendChild($_documentContainer.content);
`;
          fs.writeFile('font-icons.js', output, function (err) {
            if (err) {
              return console.error(err);
            }
          });

          const list = glyphs.map((g) => g.name);
          fs.writeFile('test/glyphs.json', JSON.stringify(list, null, 2), function (err) {
            if (err) {
              return console.error(err);
            }
          });

          // Cleanup
          fs.unlink('lumo-icons.woff', function (err) {
            if (err) {
              return console.error(err);
            }
          });
        });
    });
});
