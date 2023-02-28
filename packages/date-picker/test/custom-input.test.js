import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextRender, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-date-picker-light.js';
import { getOverlayContent, open, waitForScrollToFinish } from './helpers.js';

describe('custom input', () => {
  let datePicker, input, overlay;

  beforeEach(() => {
    datePicker = fixtureSync(`
      <vaadin-date-picker-light attr-for-value="value">
        <input class="input">
      </vaadin-date-picker-light>
    `);
    overlay = datePicker.$.overlay;
    input = datePicker.inputElement;
  });

  it('should open calendar on tap', () => {
    tap(datePicker);
    expect(overlay.opened).to.be.true;
  });

  it('should open calendar on input', () => {
    input.value = '1';
    fire(input, 'input');
    expect(overlay.opened).to.be.true;
  });

  it('should not open calendar on input when autoOpenDisabled is true', () => {
    datePicker.autoOpenDisabled = true;
    input.value = '1';
    fire(input, 'input');
    expect(overlay.opened).not.to.be.true;
  });

  it('should close on overlay date tap', () => {
    datePicker.open();
    const spy = sinon.spy(datePicker, 'close');
    const evt = new CustomEvent('date-tap', { detail: { date: new Date() }, bubbles: true, composed: true });
    getOverlayContent(datePicker).dispatchEvent(evt);
    expect(spy.called).to.be.true;
  });

  it('should show week numbers', () => {
    datePicker.showWeekNumbers = true;
    const overlayContent = getOverlayContent(datePicker);
    expect(overlayContent.showWeekNumbers).to.equal(true);
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      datePicker.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to overlay', () => {
      expect(overlay.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to overlay content', () => {
      datePicker.open();
      const overlayContent = getOverlayContent(datePicker);
      expect(overlayContent.getAttribute('theme')).to.equal('foo');
    });

    describe('in content', () => {
      beforeEach(async () => {
        await open(datePicker);
        await nextRender(datePicker);
      });

      it('should propagate theme attribute to month calendar', async () => {
        const overlayContent = getOverlayContent(datePicker);
        await waitForScrollToFinish(overlayContent);
        const monthCalendar = overlayContent.$.monthScroller.querySelector('vaadin-month-calendar');
        expect(monthCalendar.getAttribute('theme')).to.equal('foo');
      });
    });
  });
});
