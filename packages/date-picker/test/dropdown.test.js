import { expect } from '@esm-bundle/chai';
import { aTimeout, click, down, fixtureSync, touchstart } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-date-picker.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { isFullscreen, open, outsideClick } from './common.js';

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

  it('should restore focus to the field on outside click', async () => {
    datepicker.focus();
    await open(datepicker);
    outsideClick();
    await aTimeout(0);
    expect(document.activeElement).to.equal(input);
  });

  it('should focus the field on outside click', async () => {
    expect(document.activeElement).to.equal(document.body);
    await open(datepicker);
    outsideClick();
    await aTimeout(0);
    expect(document.activeElement).to.equal(input);
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

  it('should restore attribute focus-ring if it was initially set before opening', () => {
    datepicker.focus();
    datepicker.setAttribute('focus-ring', '');
    datepicker.opened = true;
    datepicker.opened = false;
    expect(datepicker.hasAttribute('focus-ring')).to.be.true;
  });

  it('should remove attribute focus-ring if it was not initially set before opening', () => {
    datepicker.focus();
    datepicker.opened = true;
    datepicker.setAttribute('focus-ring', '');
    datepicker.opened = false;
    expect(datepicker.focusElement.hasAttribute('focus-ring')).to.be.false;
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
