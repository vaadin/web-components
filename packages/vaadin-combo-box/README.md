[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://travis-ci.org/vaadin/vaadin-combo-box.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-combo-box)
![Bower version](https://img.shields.io/bower/v/vaadin-combo-box.svg)

**Automated tests are run on**

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /><br />IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /><br />Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /><br />Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /><br />Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" /><br />iOS | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" /><br />Android |
| :---------: | :---------: | :---------: | :---------: | :---------: | :---------: |
| IE11, Edge| 41 | 45 | 9 | 9| 5.1

# vaadin-combo-box

`vaadin-combo-box` is a combo box element combining a dropdown list with an
input field for filtering the list of items, a part of the
[vaadin-elements](https://github.com/vaadin/vaadin-elements) element bundle.

<img src="https://raw.githubusercontent.com/vaadin/vaadin-combo-box/master/screenshot.png" width="434" alt="Screenshot of vaadin-combo-box" />

**Features**

 - Displaying a list of `String` values.
 - Filtering the list.
 - Keyboard navigation.
 - Automatic resizing and alignment.
 - Separate mobile optimized view for mobile devices.
 - Material Design theme.
 - Compatible with [`iron-form`](https://github.com/PolymerElements/iron-form).
 - Simple and easy API.

## Getting started

- [Demos](https://cdn.vaadin.com/vaadin-elements/master/vaadin-combo-box/demo/)
- [API documentation](https://cdn.vaadin.com/vaadin-elements/master/vaadin-combo-box/)

## Developing

### Running the demos

Install required dependencies by running following lines in the project root.
```shell
$ npm install -g polyserve
$ npm install
```

Start a local server in the project root.
```shell
$ polyserve
```

After `polyserve` is running, open http://localhost:8080/components/vaadin-combo-box/demo/ in your browser.

### Running the automated tests

Open http://localhost:8080/components/vaadin-combo-box/test/ in your browser or
run from the command-line:
```shell
$ npm install -g web-component-tester
$ wct
```

## License

`vaadin-combo-box` is licensed under the Apache License 2.0.
