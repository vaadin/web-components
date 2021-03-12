[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-grid-pro)](https://www.npmjs.com/package/@vaadin/vaadin-grid-pro)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-grid-pro)](https://github.com/vaadin/vaadin-grid-pro/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-grid-pro)
[![Build Status](https://travis-ci.org/vaadin/vaadin-grid-pro.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-grid-pro)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-grid-pro/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-grid-pro?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-grid-pro.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid-pro)
[![Stars in Vaadin_Directory](https://img.shields.io/vaadin-directory/stars/vaadinvaadin-grid-pro.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid-pro)

# &lt;vaadin-grid-pro&gt;

[&lt;vaadin-grid-pro&gt;](https://vaadin.com/components/vaadin-grid-pro) is a Web Component providing &lt;element-functionality&gt;, part of the [Vaadin components](https://vaadin.com/components).

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid-pro/master/screenshot.png" width="200" alt="Screenshot of vaadin-grid-pro">](https://vaadin.com/components/vaadin-grid-pro)

## Example Usage

```html
<vaadin-grid-pro>
  <vaadin-grid-pro-edit-column path="firstName" header="First Name"></vaadin-grid-pro-edit-column>
  <vaadin-grid-pro-edit-column path="lastName" header="Last Name"></vaadin-grid-pro-edit-column>
  <vaadin-grid-pro-edit-column path="email" header="Email"></vaadin-grid-pro-edit-column>
</vaadin-grid-pro>
<script>
  // Populate the grid with data
  const grid = document.querySelector('vaadin-grid-pro');
  fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
    .then(res => res.json())
    .then(json => grid.items = json.result);
</script>
```
