import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-date-picker-light.js';
import { open, setInputValue, waitForScrollToFinish } from './helpers.js';

describe('custom input', () => {
  let datePicker, overlay;

  beforeEach(() => {
    datePicker = fixtureSync(`
      <vaadin-date-picker-light attr-for-value="value">
        <input class="input">
      </vaadin-date-picker-light>
    `);
    overlay = datePicker.$.overlay;
  });

  it('should open calendar on tap', () => {
    tap(datePicker);
    expect(overlay.opened).to.be.true;
  });

  it('should open calendar on input', () => {
    setInputValue(datePicker, '1');
    expect(overlay.opened).to.be.true;
  });

  it('should not open calendar on input when autoOpenDisabled is true', () => {
    datePicker.autoOpenDisabled = true;
    setInputValue(datePicker, '1');
    expect(overlay.opened).not.to.be.true;
  });

  it('should close on overlay date tap', async () => {
    await open(datePicker);
    const spy = sinon.spy(datePicker, 'close');
    fire(datePicker._overlayContent, 'date-tap', { date: new Date() });
    expect(spy.called).to.be.true;
  });

  it('should show week numbers', async () => {
    datePicker.showWeekNumbers = true;
    await open(datePicker);
    expect(datePicker._overlayContent.showWeekNumbers).to.be.true;
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      datePicker.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to overlay', () => {
      expect(overlay.getAttribute('theme')).to.equal('foo');
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
        const overlayContent = datePicker._overlayContent;
        await waitForScrollToFinish(overlayContent);
        const monthCalendar = overlayContent.querySelector('vaadin-month-calendar');
        expect(monthCalendar.getAttribute('theme')).to.equal('foo');
      });
    });
  });
});
