import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import '../vaadin-date-picker.js';
import { open } from './common.js';

describe('theme attribute', () => {
  let datepicker;

  beforeEach(async () => {
    datepicker = await fixture(html`<vaadin-date-picker theme="foo"></vaadin-date-picker>`);
  });

  it('should not throw if set programmatically before overlay init', () => {
    expect(() => datepicker.setAttribute('theme', 'foo')).not.to.throw(Error);
  });

  it('should propagate theme attribute to text-field', () => {
    expect(datepicker._inputElement.getAttribute('theme')).to.equal('foo');
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

    beforeEach((done) => {
      open(datepicker, () => {
        overlayContent = datepicker.$.overlay.content.querySelector('#overlay-content');
        overlayContent.$.yearScroller.bufferSize = 0;
        overlayContent.$.monthScroller.bufferSize = 1;
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
