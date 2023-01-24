import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { open, waitForScrollToFinish } from './helpers.js';

describe('theme attribute', () => {
  let datepicker;

  beforeEach(async () => {
    datepicker = fixtureSync(`<vaadin-date-picker theme="foo"></vaadin-date-picker>`);
    await nextRender();
  });

  it('should propagate theme attribute to the input container', () => {
    const inputField = datepicker.shadowRoot.querySelector('[part="input-field"]');
    expect(inputField.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay', () => {
    expect(datepicker.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay content', async () => {
    await open(datepicker);
    expect(datepicker._overlayContent.getAttribute('theme')).to.equal('foo');
  });

  describe('in content', () => {
    beforeEach(async () => {
      await open(datepicker);
    });

    it('should propagate theme attribute to month calendar', async () => {
      const overlayContent = datepicker._overlayContent;
      await waitForScrollToFinish(overlayContent);
      const monthCalendar = overlayContent.querySelector('vaadin-month-calendar');
      expect(monthCalendar.getAttribute('theme')).to.equal('foo');
    });
  });
});
