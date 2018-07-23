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

gulp.task('lint', ['lint:js', 'lint:html', 'lint:css']);

gulp.task('lint:js', function() {
  return gulp.src([
    '*.js',
    'test/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError('fail'));
});

gulp.task('lint:html', function() {
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
    .pipe(eslint.failAfterError('fail'));
});

gulp.task('lint:css', function() {
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
    }));
});

gulp.task('version:check', function() {
  const expectedVersion = new RegExp('^' + require('./package.json').version + '$');
  return gulp.src(['*.html'])
    .pipe(htmlExtract({sel: 'script'}))
    .pipe(find(/static get version.*\n.*/))
    .pipe(clip()) // Remove non-matching files
    .pipe(replace(/.*\n.*return '(.*)'.*/, '$1'))
    .pipe(grepContents(expectedVersion, {invert: true}))
    .pipe(expect({reportUnexpected: true}, []));
});

gulp.task('version:update', function() {
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
var exec = require('child_process').exec;
var fs = require('fs');
var svgpath = require('svgpath');
var svgmin = require('gulp-svgmin');

gulp.task('icons', function() {
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
        .pipe(iconfont({
          fontName: 'material-icons',
          formats: ['woff'],
          fontHeight: 2400,
          descent: 400,
          normalize: true,
        }))
        .on('glyphs', function(glyphData, options) {
          // Store for later use
          glyphs = glyphData;
        })
        .pipe(gulp.dest('.'))
        .on('finish', function(args) {
          // Generate base64 version of the font
          exec('base64 material-icons.woff', function(err, stdout, stderr) {
            // Write the output to font-icons.html
            var output = `<!-- NOTICE: Generated with 'gulp icons' -->
<link rel="import" href="../polymer/lib/elements/custom-style.html">
<link rel="import" href="version.html">

<custom-style>
  <style>
    @font-face {
      font-family: 'material-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,${stdout.trim()}) format('woff');
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
            fs.unlink('material-icons.woff');
          });
        });
    });
});
