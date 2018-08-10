[![Build Status](https://travis-ci.org/vaadin/vaadin-board.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-board)

# \<vaadin-board\>

A Web component to create flexible responsive layouts and build nice looking dashboard.
Vaadin Board key feature is how it effectively reorders the widgets on different screen sizes, maximizing the use of space and looking stunning.

## License

Vaadin Board is distributed under [Commercial Vaadin Add-on License version 3](http://vaadin.com/license/cval-3) (CVALv3). For license terms, see LICENSE.txt.

## Using Vaadin Board in your project

### Install Vaadin Board
```
$ bower install --save vaadin/vaadin-board
```

### Import Vaadin Board
 Add html import
```
<link rel="import" href="bower_components/vaadin-board/vaadin-board.html">
<script src="../../webcomponentsjs/webcomponents-lite.js"></script>
```
### Use Vaadin Board
 Create your first Vaadin Board
```
<vaadin-board>
  <vaadin-board-row>
    <div class="top a" board-cols="2">top A</div>
    <div class="top b">top B</div>
    <div class="top c">top C</div>
  </vaadin-board-row>
  <vaadin-board-row>
    <div class="mid">mid</div>
  </vaadin-board-row>
  <vaadin-board-row>
    <div class="low a">low A</div>
    <vaadin-board-row>
      <div class="top a">low B / A</div>
      <div class="top b">low B / B</div>
      <div class="top c">low B / C</div>
      <div class="top d">low B / D</div>
    </vaadin-board-row>
  </vaadin-board-row>
</vaadin-board>
```

## Viewing Demo Application

#### Clone the repository
`git clone https://github.com/vaadin/vaadin-board.git`
#### Install [polymer-cli](https://www.npmjs.com/package/polyserve):
`npm install -g polymer-cli`
#### Install Bower dependencies:
`polymer install`
#### Serve your application locally.
`polymer serve`
#### Go to http://localhost:8080/components/vaadin-board/demo/index.html to see the demo.
