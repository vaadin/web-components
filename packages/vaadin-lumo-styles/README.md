![Bower version](https://img.shields.io/bower/v/vaadin-valo-theme.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-valo-theme.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-valo-theme)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Valo Theme for Vaadin Elements

`vaadin-valo-theme` is customizable theme for the [Vaadin Core Elements](https://vaadin.com/elements).

## Demos and documentation

Links to demos and documentation can be found from the [release notes](https://github.com/vaadin/vaadin-valo-theme/releases).


## Running demos and tests in browser

1. Fork the `vaadin-valo-theme` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-valo-theme` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-valo-theme/demo
  - http://127.0.0.1:8080/components/vaadin-valo-theme/test


## Running tests from the command line

1. When in the `vaadin-valo-theme` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
