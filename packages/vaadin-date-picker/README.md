# &lt;vaadin-date-picker&gt;

`<vaadin-date-picker>` is a [Polymer](http://polymer-project.org) element providing a date selection field which includes a scrollable month calendar view, part of the [Vaadin Core Elements](https://vaadin.com/elements).

This element is still in alpha stage. For a list of planned features, see [#30](https://github.com/vaadin/vaadin-date-picker/issues/30).

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-date-picker/master/screenshot.png" width="443" alt="Screenshot of vaadin-date-picker" />](https://vaadin.com/elements)

## Developing

### Running the demos

Install required dependencies by running following lines in the project root.
```shell
$ npm install -g polyserve bower
$ npm install
$ bower install
```

Start a local server in the project root.
```shell
$ polyserve
```

After `polyserve` is running, open http://localhost:8080/components/vaadin-date-picker/demo/ in your browser.

### Running the automated tests

Open http://localhost:8080/components/vaadin-date-picker/test/ in your browser or
run from the command-line:
```shell
$ npm install -g web-component-tester
$ wct
```

## License

`vaadin-date-picker` is licensed under the Apache License 2.0.
