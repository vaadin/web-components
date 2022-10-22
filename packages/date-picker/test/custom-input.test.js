import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-date-picker-light.js';
import { getOverlayContent, open, waitForScrollToFinish } from './common.js';

describe('custom input', () => {
  let datepicker, input, overlay;

  beforeEach(() => {
    datepicker = fixtureSync(`
      <vaadin-date-picker-light attr-for-value="value">
        <input class="input">
      </vaadin-date-picker-light>
    `);
    overlay = datepicker.$.overlay;
    input = datepicker.inputElement;
  });

  it('should open calendar on tap', () => {
    tap(datepicker);
    expect(overlay.opened).to.be.true;
  });

  it('should open calendar on input', () => {
    input.value = '1';
    fire(input, 'input');
    expect(overlay.opened).to.be.true;
  });

  it('should not open calendar on input when autoOpenDisabled is true', () => {
    datepicker.autoOpenDisabled = true;
    input.value = '1';
    fire(input, 'input');
    expect(overlay.opened).not.to.be.true;
  });

  it('should close on overlay date tap', async () => {
    await open(datepicker);
    const spy = sinon.spy(datepicker, 'close');
    const evt = new CustomEvent('date-tap', { detail: { date: new Date() }, bubbles: true, composed: true });
    getOverlayContent(datepicker).dispatchEvent(evt);
    expect(spy.called).to.be.true;
  });

  it('should show week numbers', async () => {
    datepicker.showWeekNumbers = true;
    await open(datepicker);
    const overlayContent = getOverlayContent(datepicker);
    expect(overlayContent.showWeekNumbers).to.be.true;
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      datepicker.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to overlay', () => {
      expect(overlay.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to overlay content', async () => {
      await open(datepicker);
      const overlayContent = getOverlayContent(datepicker);
      expect(overlayContent.getAttribute('theme')).to.equal('foo');
    });

    describe('in content', () => {
      beforeEach(async () => {
        await open(datepicker);
      });

      it('should propagate theme attribute to month calendar', async () => {
        const overlayContent = getOverlayContent(datepicker);
        await waitForScrollToFinish(overlayContent);
        const monthCalendar = overlayContent.$.monthScroller.querySelector('vaadin-month-calendar');
        expect(monthCalendar.getAttribute('theme')).to.equal('foo');
      });
    });
  });
});
