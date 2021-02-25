#!/usr/bin/env node
const replace = require('replace-in-file');

const wrongHeader = (year) => `/**
@license
Copyright (c) ${year} Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/`;

const goodHeader = (year) => `/**
 * @license
 * Copyright (c) ${year} Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */`;

const skipTests = {
  files: ['packages/**/src/*.js', 'packages/**/*.js'],
  from: [
    `Copyright (c) 2020 Vaadin Ltd.`,
    `Copyright (c) 2017 - 2020 Vaadin Ltd`,
    `Copyright (c) 2019 - 2020 Vaadin Ltd`,
    wrongHeader(2017),
    wrongHeader(2019)
  ],
  to: [
    `Copyright (c) 2021 Vaadin Ltd.`,
    `Copyright (c) 2017 - 2021 Vaadin Ltd.`,
    `Copyright (c) 2019 - 2021 Vaadin Ltd.`,
    goodHeader(2021),
    goodHeader(2021)
  ]
};

replace.sync(skipTests);
