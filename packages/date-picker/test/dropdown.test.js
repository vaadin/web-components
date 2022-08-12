import { expect } from '@esm-bundle/chai';
import { aTimeout, click, down, fixtureSync, mousedown, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-date-picker.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { getFocusedCell, getOverlayContent, isFullscreen, open, outsideClick } from './common.js';

describe('dropdown', () => {
  let datepicker, input;

  beforeEach(() => {
    datepicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    input = datepicker.inputElement;
  });

  it('should update position of the overlay after changing opened property', () => {
    datepicker.opened = true;
    expect(input.getBoundingClientRect().bottom).to.be.closeTo(datepicker.$.overlay.getBoundingClientRect().top, 0.01);
  });

  it('should detach overlay on datepicker detach', () => {
    datepicker.open();
    datepicker.parentElement.removeChild(datepicker);
    expect(datepicker.$.overlay.parentElement).to.not.be.ok;
  });

  describe('outside click', () => {
    it('should restore focus to the input on outside click', async () => {
      input.focus();
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the input on outside click', async () => {
      expect(document.activeElement).to.equal(document.body);
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus-ring attribute set before opening on outside click', async () => {
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not remove focus-ring attribute set after opening on outside click', async () => {
      await open(datepicker);
      input.focus();
      // Move focus to the calendar
      await sendKeys({ press: 'Tab' });
      outsideClick();
      await aTimeout(0);
      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring attribute if it was not set before opening', async () => {
      await open(datepicker);
      outsideClick();
      await aTimeout(0);
      expect(datepicker.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('date tap', () => {
    function dateTap() {
      const content = getOverlayContent(datepicker);
      const date = getFocusedCell(content);
      mousedown(date);
      date.focus();
      date.click();
    }

    it('should close the overlay on date tap', async () => {
      input.focus();
      await open(datepicker);

      dateTap();
      await aTimeout(0);

      expect(datepicker.opened).to.be.false;
    });

    it('should restore focus to the input on date tap', async () => {
      input.focus();
      await open(datepicker);

      dateTap();
      await aTimeout(0);

      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus-ring attribute set before opening on date tap', async () => {
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });
      await open(datepicker);

      dateTap();
      await aTimeout(0);

      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not remove focus-ring attribute after opening on date tap', async () => {
      await open(datepicker);
      // Focus the input with Tab
      await sendKeys({ press: 'Tab' });

      dateTap();
      await aTimeout(0);

      expect(datepicker.hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('virtual keyboard', () => {
    it('should disable virtual keyboard on close', async () => {
      await open(datepicker);
      datepicker.close();
      expect(input.inputMode).to.equal('none');
    });

    it('should re-enable virtual keyboard on touchstart', async () => {
      await open(datepicker);
      datepicker.close();
      touchstart(datepicker);
      expect(input.inputMode).to.equal('');
    });

    it('should re-enable virtual keyboard on blur', async () => {
      await open(datepicker);
      datepicker.close();
      await sendKeys({ press: 'Tab' });
      expect(input.inputMode).to.equal('');
    });
  });

  describe('sizing', () => {
    beforeEach(() => {
      const viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0');
      document.getElementsByTagName('head')[0].appendChild(viewport);
      datepicker._fullscreenMediaQuery = 'max-width: 520px';
    });

    it('should select fullscreen/desktop mode', (done) => {
      setTimeout(() => {
        datepicker.open();
        datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
          const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          const fullscreen = viewportWidth < 520;

          expect(isFullscreen(datepicker)).to.equal(fullscreen);
          done();
        });
      });
    });
  });
});

class DatePickerWrapper extends PolymerElement {
  static get template() {
    return html`<vaadin-date-picker id="datepicker" label="foo" clear-button-visible></vaadin-date-picker>`;
  }
}

customElements.define('vaadin-date-picker-wrapper', DatePickerWrapper);

describe('wrapped', () => {
  let datepicker, clearButton, toggleButton;

  beforeEach(() => {
    datepicker = fixtureSync(`<vaadin-date-picker-wrapper></vaadin-date-picker-wrapper>`).$.datepicker;
    toggleButton = datepicker.shadowRoot.querySelector('[part="toggle-button"]');
    clearButton = datepicker.shadowRoot.querySelector('[part="clear-button"]');
  });

  it('should not close on calendar icon down', (done) => {
    datepicker.open();
    datepicker.$.overlay.addEventListener('vaadin-overlay-open', () => {
      down(toggleButton);
      expect(datepicker.$.overlay.opened).to.be.true;
      done();
    });
  });

  it('should not close on clear-button down', () => {
    datepicker.open();
    datepicker.value = '2001-01-01';
    click(clearButton);
    expect(datepicker.$.overlay.opened).to.be.true;
  });

  it('should not open on clear-button down if was not opened initially', () => {
    datepicker.value = '2001-01-01';
    click(clearButton);
    expect(datepicker.$.overlay.hasAttribute('disable-upgrade')).to.be.true;
  });
});
