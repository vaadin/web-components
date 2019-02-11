#!/usr/bin/env node

/**
 * Usage:
 *
 *   $ npm i tree-flatten
 *   $ node demo/generate-flat-tree.js > demo/tree-data.js
 */


const data = require('./demo-categories.json');
const flatten = require('tree-flatten');

// get full object
const result = flatten(data, 'children');

const output = result.map(({id, text, parent, isLeaf}) => {
  return {
    uuid: id,
    name: text,
    parentUuid: parent,
    hasChildren: !isLeaf
  };
});

console.log(`\
window.Vaadin = window.Vaadin || {};
window.Vaadin.GridDemo = window.Vaadin.GridDemo || {};
window.Vaadin.GridDemo._treeData = ${JSON.stringify(output.slice(1))};
`);
