import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { open } from './helpers.js';

describe('theme attribute', () => {
  let datePicker;

  beforeEach(() => {
    datePicker = fixtureSync(`<vaadin-date-picker theme="foo"></vaadin-date-picker>`);
  });

  it('should propagate theme attribute to the input container', () => {
    const inputField = datePicker.shadowRoot.querySelector('[part="input-field"]');
    expect(inputField.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay', () => {
    datePicker.open();
    expect(datePicker.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay content', () => {
    datePicker.open();
    const overlayContent = datePicker.$.overlay.content.querySelector('#overlay-content');
    expect(overlayContent.getAttribute('theme')).to.equal('foo');
  });

  describe('in content', () => {
    let overlayContent;

    beforeEach(async () => {
      await open(datePicker);
      overlayContent = datePicker.$.overlay.content.querySelector('#overlay-content');
      overlayContent.$.yearScroller.bufferSize = 0;
      overlayContent.$.monthScroller.bufferSize = 1;
      overlayContent.$.yearScroller._finishInit();
      overlayContent.$.monthScroller._finishInit();
    });

    it('should propagate theme attribute to month calendar', () => {
      const monthCalendar = overlayContent.$.monthScroller.querySelector('vaadin-month-calendar');
      expect(monthCalendar.getAttribute('theme')).to.equal('foo');
    });
  });
});
