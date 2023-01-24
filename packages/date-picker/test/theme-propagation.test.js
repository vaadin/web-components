import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-date-picker.js';
import { open } from './helpers.js';

describe('theme attribute', () => {
  let datepicker;

  beforeEach(() => {
    datepicker = fixtureSync(`<vaadin-date-picker theme="foo"></vaadin-date-picker>`);
  });

  it('should propagate theme attribute to the input container', () => {
    const inputField = datepicker.shadowRoot.querySelector('[part="input-field"]');
    expect(inputField.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay', () => {
    datepicker.open();
    expect(datepicker.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay content', () => {
    datepicker.open();
    const overlayContent = datepicker.$.overlay.content.querySelector('#overlay-content');
    expect(overlayContent.getAttribute('theme')).to.equal('foo');
  });

  describe('in content', () => {
    let overlayContent;

    beforeEach(async () => {
      await open(datepicker);
      overlayContent = datepicker.$.overlay.content.querySelector('#overlay-content');
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
