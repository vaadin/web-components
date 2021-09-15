import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-time-picker.js';

describe('theme attribute', () => {
  let timePicker;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker theme="foo"></vaadin-time-picker>`);
  });

  it('should propagate theme attribute to input container', () => {
    const inputField = timePicker.shadowRoot.querySelector('[part="input-field"]');
    expect(inputField.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to combo-box', () => {
    expect(timePicker.$.comboBox.getAttribute('theme')).to.equal('foo');
  });
});
