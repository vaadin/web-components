'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var htmlExtract = require('gulp-html-extract');
var stylelint = require('gulp-stylelint');
var find = require('gulp-find');
var replace = require('gulp-replace');
var expect = require('gulp-expect-file');
var grepContents = require('gulp-grep-contents');
var clip = require('gulp-clip-empty-files');
var git = require('gulp-git');

gulp.task('lint:js', async function() {
  return gulp.src([
    '*.js',
    'test/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError('fail'))
    .on('error', function(err) {
      // return console.error(err);
    });
});

gulp.task('lint:html', async function() {
  return gulp.src([
    '*.html',
    'demo/**/*.html',
    'test/**/*.html'
  ])
    .pipe(htmlExtract({
      sel: 'script, code-example code',
      strip: true
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError('fail'))
    .on('error', function(err) {
      // return console.error(err);
    });
});

gulp.task('lint:css', async function() {
  return gulp.src([
    '*.html',
    'demo/**/*.html',
    'test/**/*.html'
  ])
    .pipe(htmlExtract({
      sel: 'style'
    }))
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
    .on('error', function(err) {
      // return console.error(err);
    });
});

gulp.task('version:check', async function() {
  const expectedVersion = new RegExp('^' + require('./package.json').version + '$');
  return gulp.src(['*.html'])
    .pipe(htmlExtract({sel: 'script'}))
    .pipe(find(/static get version.*\n.*/))
    .pipe(clip()) // Remove non-matching files
    .pipe(replace(/.*\n.*return '(.*)'.*/, '$1'))
    .pipe(grepContents(expectedVersion, {invert: true}))
    .pipe(expect({reportUnexpected: true}, []));
});

gulp.task('version:update', async function() {
  // Should be run from 'preversion'
  // Assumes that the old version is in package.json and the new version in the `npm_package_version` environment variable
  const oldversion = require('./package.json').version;
  const newversion = process.env.npm_package_version;
  if (!oldversion) {
    throw new 'No old version found in package.json';
  }
  if (!newversion) {
    throw new 'New version must be given as a npm_package_version environment variable.';
  }
  return gulp.src(['*.html'])
    .pipe(replace(oldversion, newversion))
    .pipe(gulp.dest('.'))
    .pipe(git.add());
});

/* Generate font icons from source SVGs */

var iconfont = require('gulp-iconfont');
var fs = require('fs');
var svgmin = require('gulp-svgmin');
var sort = require('gulp-sort');

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

gulp.task('icons', async function() {
  var folder = 'icons/svg/';
  var glyphs;

  // Optimize the source files
  gulp.src(folder + '*.svg')
    .pipe(svgmin({
      plugins: [{
        removeTitle: true
      }, {
        cleanupNumericValues: {
          floatPrecision: 6
        }
      }, {
        convertPathData: {
          floatPrecision: 6
        }
      }]
    }))
    .pipe(gulp.dest(folder))
    .on('finish', function(args) {
      // icon font
      gulp.src(folder + '*.svg')
        .pipe(sort({
          comparator: function(file1, file2) {
            return sortIconFilesNormalized(file1.relative, file2.relative);
          }
        }))
        .pipe(iconfont({
          fontName: 'material-icons',
          formats: ['woff'],
          fontHeight: 2400,
          descent: 400,
          normalize: true,
          timestamp: 1, // Truthy!
        }))
        .on('glyphs', function(glyphData, options) {
          // Store for later use
          glyphs = glyphData;
        })
        .pipe(gulp.dest('.'))
        .on('finish', function(args) {
          // Generate base64 version of the font
          const materialIconsWoff = fs.readFileSync('material-icons.woff');
          // Write the output to font-icons.html
          let output = `<!-- NOTICE: Generated with 'gulp icons' -->
<link rel="import" href="../polymer/lib/elements/custom-style.html">
<link rel="import" href="version.html">

<custom-style>
  <style>
    @font-face {
      font-family: 'material-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,${materialIconsWoff.toString('base64')}) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
`;
          glyphs.forEach(g => {
            var name = g.name.replace(/\s/g, '-').toLowerCase();
            var unicode = '\\' + g.unicode[0].charCodeAt(0).toString(16);
            output += `      --material-icons-${name}: "${unicode}";\n`;
          });
          output += `    }
  </style>
</custom-style>
`;
          fs.writeFile('font-icons.html', output, function(err) {
            if (err) {
              return console.error(err);
            }
          });

          // Cleanup
          fs.unlink('material-icons.woff', function(err) {
            if (err) {
              return console.error(err);
            }
          });
        });
    });
});

gulp.task('lint', gulp.parallel('lint:js', 'lint:html', 'lint:css'));
