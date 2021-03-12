import '../../src/vaadin-rich-text-editor';

const customField = document.createElement('vaadin-rich-text-editor');

const assert = <T>(value: T) => value;

customField.addEventListener('html-value-changed', (event) => {
  assert<string>(event.detail.value);
});

customField.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
