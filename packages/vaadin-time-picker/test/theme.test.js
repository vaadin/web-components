import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-time-picker.js';

describe('theme attribute', () => {
  let timePicker;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker theme="foo"></vaadin-time-picker>`);
  });

  it('should propagate theme attribute to text-field', () => {
    expect(timePicker.__inputElement.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to combo-box-light', () => {
    expect(timePicker.__dropdownElement.getAttribute('theme')).to.equal('foo');
  });
});
