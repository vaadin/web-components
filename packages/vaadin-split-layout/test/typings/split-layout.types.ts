import '../../src/vaadin-split-layout';

const assert = <T>(value: T) => value;

const layout = document.createElement('vaadin-split-layout');

layout.addEventListener('splitter-dragend', (event) => {
  assert<Event>(event);
});
