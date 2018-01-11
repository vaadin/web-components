![Bower version](https://img.shields.io/bower/v/vaadin-lumo-styles.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-lumo-styles.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-lumo-styles)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Lumo Theme for Vaadin Elements

`vaadin-lumo-styles` is customizable theme for the [Vaadin Core Elements](https://vaadin.com/elements).

## Demos and documentation

Links to demos and documentation can be found from the [release notes](https://github.com/vaadin/vaadin-lumo-styles/releases).


## Running demos and tests in browser

1. Fork the `vaadin-lumo-styles` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-lumo-styles` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-lumo-styles/demo
  - http://127.0.0.1:8080/components/vaadin-lumo-styles/test


## Running tests from the command line

1. When in the `vaadin-lumo-styles` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members

## Updating the version number
Use `npm version <new version>` to release a new version. This will update
the version number in `package.json` and in other relevant places such as `version.html`

## License

Apache License 2.0
