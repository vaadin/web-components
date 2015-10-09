var cheerio = require('cheerio');
var fs = require('fs');
var file = process.argv[2];
var id = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.svg'));

var svgContent = fs.readFileSync(file, 'utf8');
var svg = cheerio.load(svgContent, { xmlMode: true })('svg');

// Remove fill attributes.
svg.children('[fill]').removeAttr('fill');

// Output the "meat" of the SVG as group element.
console.log('<g id="' + id + '">' + svg.children() + '</g>');
