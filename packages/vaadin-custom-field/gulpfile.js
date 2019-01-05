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
const semver = require('semver');
const fs = require('fs');
const path = require('path');

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

// https://github.com/bower/bower/issues/2522
gulp.task('bower:check', function(cb) {
  function verifyIfPresent(resolvedPackage, bowerJson, dependenciesPath) {
    const projectDependency = (bowerJson[dependenciesPath] || {})[resolvedPackage.name];
    if (projectDependency) {
      // allow branches for devDependencies, e.g. in `vaadin-upload`:
      // "mock-http-request": "abuinitski/MockHttpRequest#npm_fix"
      if (dependenciesPath === 'devDependencies') {
        return true;
      }
      // allow the version ranges like this one: "^v2.0.0"
      const match = projectDependency.match(/\^?v?(\d+\.){1}(\d+\.){1}(\d+)(-(alpha|beta)\d+)?$/);
      if (match === null) {
        console.error('Invalid version: ' + projectDependency);
        return false;
      }
      const range = match[0];
      if (!semver.satisfies(resolvedPackage.version, range)) {
        console.error(`
          range ${bowerJsonPath}.${dependenciesPath}.${resolvedPackage.name}: '${range}'
          incorrectly resolved to: '${resolvedPackage.version}'
          possible correct range: '^${resolvedPackage.version}'
        `);
        return false;
      }
    }
    return true;
  }
  const bowerComponents = './bower_components';
  const bowerJsonPath = './bower.json';
  const bowerJson = require(bowerJsonPath);
  let bowerJsonValid = true;
  for (const packageDirectoryName of fs.readdirSync(bowerComponents)) {
    const dependencyFilePath = path.join(bowerComponents, packageDirectoryName, '.bower.json');
    const resolvedPackage = require(`./${dependencyFilePath}`);
    bowerJsonValid = verifyIfPresent(resolvedPackage, bowerJson, 'dependencies')
            && verifyIfPresent(resolvedPackage, bowerJson, 'devDependencies')
            && bowerJsonValid;
  }
  cb(bowerJsonValid ? null : new Error(`Bower has dependencies resolutions that violate semver and don't allow webjars.org deployment.`));
});

gulp.task('version:check', ['bower:check'], function() {
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
