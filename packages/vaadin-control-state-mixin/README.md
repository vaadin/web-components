![Bower version](https://img.shields.io/bower/v/vaadin-control-state-mixin.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-control-state-mixin.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-control-state-mixin)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# vaadin-control-state-mixin
A mixin which adds `focused` and `focus-ring` states to an element.

## Contributing

1. Fork the `vaadin-control-state-mixin` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-control-state-mixin` directory, run `npm install` to install dependencies.


## Running tests in browser

1. Install [polyserve](https://www.npmjs.com/package/polyserve): `npm install -g polyserve`

1. When in the `vaadin-control-state-mixin` directory, run `polyserve --open`, browser will automatically open the component API documentation.

1. You can also open in-browser tests by adding **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-control-state-mixin/test/index.html


## Running tests from the command line

1. Install [web-component-tester](https://www.npmjs.com/package/web-component-tester): `npm install -g web-component-tester`

1. When in the `vaadin-control-state-mixin` directory, run `wct` or `npm test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
