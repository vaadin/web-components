#!/usr/bin/env node
const fs = require('fs');

const analysis = require('../analysis.json');
const elements = analysis.elements.filter((el) => el.privacy === 'public');

const result = {
  // eslint-disable-next-line camelcase
  schema_version: '1.0.0',
};

result.mixins = analysis.mixins;
result.elements = elements;

fs.writeFileSync('./analysis.json', JSON.stringify(result, null, 2));
