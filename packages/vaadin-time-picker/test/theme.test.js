import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import '../vaadin-time-picker.js';

describe('theme attribute', () => {
  let timePicker;

  beforeEach(async () => {
    timePicker = await fixture(html`<vaadin-time-picker theme="foo"></vaadin-time-picker>`);
  });

  it('should propagate theme attribute to text-field', () => {
    expect(timePicker.__inputElement.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to combo-box-light', () => {
    expect(timePicker.__dropdownElement.getAttribute('theme')).to.equal('foo');
  });
});
