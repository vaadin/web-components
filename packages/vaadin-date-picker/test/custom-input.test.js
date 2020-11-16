import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-date-picker-light.js';
import { getOverlayContent, listenForEvent, open, tap } from './common.js';

describe('custom input', () => {
  let datepicker, overlayContent;

  beforeEach(async () => {
    datepicker = fixtureSync(`
      <vaadin-date-picker-light attr-for-value="value">
        <input class="input">
      </vaadin-date-picker-light>
    `);
    overlayContent = datepicker.$.overlay.content.querySelector('#overlay-content');
    overlayContent.$.monthScroller.bufferSize = 0;
    overlayContent.$.yearScroller.bufferSize = 0;
    await aTimeout();
  });

  it('should open calendar on tap', () => {
    tap(datepicker);
    expect(datepicker.$.overlay.opened).to.be.true;
  });

  it('should open calendar on input', (done) => {
    const target = datepicker._inputElement;
    target.value = '1';

    listenForEvent(document, 'vaadin-overlay-open', () => {
      expect(datepicker.$.overlay.opened).to.be.true;
      done();
    });

    datepicker._nativeInput.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  });

  it('should not open calendar on input when autoOpenDisabled is true', () => {
    const target = datepicker._inputElement;
    datepicker.autoOpenDisabled = true;
    target.value = '1';
    datepicker._nativeInput.dispatchEvent(new CustomEvent('input', { bubbles: true }));
    expect(datepicker.$.overlay.opened).not.to.be.true;
  });

  it('should show week numbers', () => {
    datepicker.showWeekNumbers = true;
    expect(overlayContent.showWeekNumbers).to.equal(true);
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      datepicker.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to overlay', () => {
      expect(datepicker.$.overlay.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to overlay content', () => {
      datepicker.open();
      const overlayContent = getOverlayContent(datepicker);
      expect(overlayContent.getAttribute('theme')).to.equal('foo');
    });

    describe('in content', () => {
      beforeEach((done) => {
        overlayContent.$.monthScroller.bufferSize = 1;
        open(datepicker, () => {
          overlayContent.$.yearScroller._finishInit();
          overlayContent.$.monthScroller._finishInit();
          done();
        });
      });

      it('should propagate theme attribute to month calendar', () => {
        const monthCalendar = overlayContent.$.monthScroller.querySelector('vaadin-month-calendar');
        expect(monthCalendar.getAttribute('theme')).to.equal('foo');
      });
    });
  });
});
