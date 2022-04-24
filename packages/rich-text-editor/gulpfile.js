/* eslint-env node */
'use strict';

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const fs = require('fs');

gulp.task('icons', (done) => {
  let glyphs;
  const fontName = 'vaadin-rte-icons';
  const fileName = 'vaadin-rich-text-editor-icons';

  gulp
    .src('icons/*.svg')
    .pipe(
      iconfont({
        fontName: fileName,
        formats: ['woff'],
        fontHeight: 1000,
        ascent: 850,
        descent: 150,
        fixedWidth: true,
        normalize: true,
        timestamp: 1 // Truthy!
      })
    )
    .on('glyphs', (glyphData) => {
      // Store for later use
      glyphs = glyphData;
    })
    .pipe(gulp.dest('.'))
    .on('finish', () => {
      // Generate base64 version of the font
      const iconsWoff = fs.readFileSync('vaadin-rich-text-editor-icons.woff');

      let output = `/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = \`
  <style>
    @font-face {
      font-family: '${fontName}';
      src: url(data:application/font-woff;charset=utf-8;base64,${iconsWoff.toString('base64')}) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
`;
      glyphs.forEach((g) => {
        const name = g.name.replace(/\s/g, '-').toLowerCase();
        const unicode = '\\\\' + g.unicode[0].charCodeAt(0).toString(16);
        output += `      --${fontName}-${name}: "${unicode}";\n`;
      });
      output += `    }
  </style>
\`;

document.head.appendChild($_documentContainer.content);

export const iconsStyles = css\`\n`;
      glyphs.forEach((g, index) => {
        const name = g.name.replace(/\s/g, '-').toLowerCase();
        output += `  [part~='toolbar-button-${name}']::before {
    content: var(--${fontName}-${name});
  }\n`;
        if (index < glyphs.length - 1) {
          output += `
`;
        }
      });
      output += `
  /* RTL specific styles */
  :host([dir='rtl']) [part~='toolbar-button-redo']::before {
    content: var(--vaadin-rte-icons-undo);
  }

  :host([dir='rtl']) [part~='toolbar-button-undo']::before {
    content: var(--vaadin-rte-icons-redo);
  }`;
      output += `\n\`;\n`;
      output += `
// Register a module with ID for backwards compatibility.
registerStyles('', iconsStyles, { moduleId: 'vaadin-rich-text-editor-icons' });\n`;
      fs.writeFile(`src/${fileName}.js`, output, (err) => {
        if (err) {
          return console.error(err);
        }
      });

      // Cleanup
      fs.unlink(`${fileName}.woff`, (err) => {
        if (err) {
          return console.error(err);
        }
        done();
      });
    });
});
