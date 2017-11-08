#!/usr/bin/env node

/**
 * Usage:
 *
 *   $ npm i faker
 *   $ node demo/generate-fs.js > demo/fs-data.js
 */

var faker = require('faker');
faker.seed(1234);

function filesystem(n, array, parentUuid) {
  if (!array) {
    array = [];
  }

  const nChildren = Math.floor(n / 5);

  if (nChildren > 0) {
    for (let i = 0; i < n / 2; i++) {
      const dir = {
        hasChildren: true,
        name: faker.system.commonFileName().split('.')[0],
        size: '',
        uuid: faker.random.uuid(),
        parentUuid: parentUuid
      };
      array.push(dir);
      filesystem(nChildren, array, dir.uuid);
    }
  }

  for (let i = 0; i < n / 2; i++) {
    array.push({
      hasChildren: false,
      name: faker.system.commonFileName(),
      size: faker.random.number() / 1000 + ' MB',
      uuid: faker.random.uuid(),
      parentUuid: parentUuid
    });
  }

  return array;
}

console.log(`\
window.Vaadin = window.Vaadin || {};
window.Vaadin.GridDemo = window.Vaadin.GridDemo || {};
window.Vaadin.GridDemo._fsData = ${JSON.stringify(filesystem(50))};
`);
