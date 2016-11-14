
'use strict';

var gulp = require('gulp');
var modify = require('gulp-modify');
var cheerio = require('cheerio');
var concat = require('gulp-concat');

gulp.task('default', function() {
  return gulp.src(['assets/svg/*.svg'], {base: '.'})
    .pipe(modify({
      fileModifier: function(file, contents) {
        var id = file.path.replace(/.*\/(.*).svg/,'$1');
        var svg = cheerio.load(contents, { xmlMode: true })('svg');
        // Remove fill attributes.
        svg.children('[fill]').removeAttr('fill');
        // Output the "meat" of the SVG as group element.
        return '<g id="' + id + '">' + svg.children() + '</g>';
      }
    }))
    .pipe(concat('vaadin-icons.html'))
    .pipe(modify({
      fileModifier: function(file, contents) {
        // Enclose all icons in an iron-iconset-svg
        return `<link rel="import" href="../iron-icon/iron-icon.html">
<link rel="import" href="../iron-iconset-svg/iron-iconset-svg.html">
<iron-iconset-svg name="vaadin-icons" size="16">
<svg><defs>
` + contents + `
</defs></svg>
</iron-iconset-svg>
`;
      }
    }))
    .pipe(gulp.dest('.'));
});

// Generates an AsciiDoc table of all icons from the JSON metadata.
gulp.task('docs:table', () => {
  const iconData = require('./assets/vaadin-font-icons.json');

  console.log('[width="100%", options="header"]');
  console.log('|======================');
  console.log('| Icon | Name | Ligature | Unicode | Categories | Tags');
  iconData.forEach((icon) => {
    console.log(`| image:../assets/png/${icon.name}.png[] | [propertyname]#${icon.name}# | ${icon.name} | ${icon.code} | ${icon.categories.join(', ')} | ${icon.meta.join(', ')}`);
  });
  console.log('|======================');
});
