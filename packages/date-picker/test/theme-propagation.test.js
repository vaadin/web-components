import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { open, untilOverlayScrolled } from './helpers.js';

describe('theme attribute', () => {
  let datePicker;

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker theme="foo"></vaadin-date-picker>`);
    await nextRender();
  });

  it('should propagate theme attribute to the input container', () => {
    const inputField = datePicker.shadowRoot.querySelector('[part="input-field"]');
    expect(inputField.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay', () => {
    expect(datePicker.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay content', async () => {
    await open(datePicker);
    expect(datePicker._overlayContent.getAttribute('theme')).to.equal('foo');
  });

  describe('in content', () => {
    beforeEach(async () => {
      await open(datePicker);
    });

    it('should propagate theme attribute to month calendar', async () => {
      await untilOverlayScrolled(datePicker);
      const monthCalendar = datePicker._overlayContent.querySelector('vaadin-month-calendar');
      expect(monthCalendar.getAttribute('theme')).to.equal('foo');
    });
  });
});
