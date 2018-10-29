'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const htmlExtract = require('gulp-html-extract');
const lec = require('gulp-line-ending-corrector');
const stylelint = require('gulp-stylelint');
const find = require('gulp-find');
const replace = require('gulp-replace');
const expect = require('gulp-expect-file');
const grepContents = require('gulp-grep-contents');
const clip = require('gulp-clip-empty-files');
const git = require('gulp-git');
const iconfont = require('gulp-iconfont');
const exec = require('child_process').exec;
const fs = require('fs');

gulp.task('lint', ['lint:js', 'lint:html', 'lint:css']);

gulp.task('lint:js', function() {
  return gulp.src([
    '*.js',
    'test/**/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError('fail'));
});

gulp.task('lint:html', function() {
  return gulp.src([
    '*.html',
    'src/**/*.html',
    'demo/**/*.html',
    'test/**/*.html'
  ])
    .pipe(htmlExtract({
      sel: 'script, code-example code',
      strip: true
    }))
    .pipe(lec())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError('fail'));
});

gulp.task('lint:css', function() {
  return gulp.src([
    '*.html',
    'src/**/*.html',
    'demo/**/*.html',
    'theme/**/*.html',
    'test/**/*.html'
  ])
    .pipe(htmlExtract({
      sel: 'style'
    }))
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});
gulp.task('version:check', function() {
  const expectedVersion = new RegExp('^' + require('./package.json').version + '$');
  return gulp.src(['src/*.html'])
    .pipe(htmlExtract({sel: 'script'}))
    .pipe(find(/static get version.*\n.*/))
    .pipe(clip()) // Remove non-matching files
    .pipe(replace(/.*\n.*return '(.*)'.*/, '$1'))
    .pipe(grepContents(expectedVersion, {invert: true}))
    .pipe(expect({reportUnexpected: true}, []));
});

gulp.task('version:update', ['version:check'], function() {
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
  return gulp.src(['src/*.html'])
    .pipe(replace(oldversion, newversion))
    .pipe(gulp.dest('src'))
    .pipe(git.add());
});

gulp.task('icons', function() {
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
        });
      });
    });
});
