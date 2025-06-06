import * as cheerio from 'cheerio';
import { dest, src, task } from 'gulp';
import concat from 'gulp-concat';
import { gulpPlugin } from 'gulp-plugin-extras';
import { basename } from 'path';

function createCopyright() {
  return `/**
 * @license
 * Copyright (c) 2015 - ${new Date().getFullYear()} Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */`;
}

function transformIcon() {
  return gulpPlugin('gulp-transform-icon', (file) => {
    const id = basename(file.path, '.svg');
    const svg = cheerio.load(file.contents, { xmlMode: true })('svg');
    // Remove fill attributes.
    svg.children('[fill]').removeAttr('fill');
    // Add closing tags instead of self-closing.
    const content = svg.children().toString().replace(/"\/>/gu, '"></path>');
    console.warn(id, content);
    // Output the "meat" of the SVG as group element.
    file.contents = Buffer.from(`<g id="vaadin:${id}">${content}</g>`);
    return file;
  });
}

function createIconset() {
  return gulpPlugin('gulp-create-iconset', (file) => {
    // Enclose all icons in a vaadin-iconset
    const contents = `${createCopyright()}
import { Iconset } from '@vaadin/icon/vaadin-iconset.js';

const template = document.createElement('template');

template.innerHTML = \`<svg><defs>\n${file.contents}\n</defs></svg>\`;

Iconset.register('vaadin', 16, template);\n`;
    file.contents = Buffer.from(contents);
    return file;
  });
}

task('icons', () => {
  return src(['assets/svg/*.svg'], { base: '.' })
    .pipe(transformIcon())
    .pipe(concat('vaadin-iconset.js'))
    .pipe(createIconset())
    .pipe(dest('.'));
});
