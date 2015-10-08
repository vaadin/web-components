var cheerio = require('cheerio');
var fs = require('fs');
var file = process.argv[2];
var id = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.svg'));

var svgContent = fs.readFileSync(file, 'utf8');
var svg = cheerio.load(svgContent, { xmlMode: true });

var meat = cheerio.xml(svg('svg').children());
console.log('<g id="' + id + '">' + meat + '</g>');
