import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-progress-bar.js';

describe('progress bar', () => {
  let progress;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      progress = fixtureSync('<vaadin-progress-bar></vaadin-progress-bar>');
      tagName = progress.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('basic', () => {
    let value;

    beforeEach(async () => {
      progress = fixtureSync('<vaadin-progress-bar></vaadin-progress-bar>');
      await nextRender();
      value = progress.shadowRoot.querySelector('[part="value"]');
    });

    it('should have proper scale', () => {
      progress.value = 0.1;
      expect(value.getBoundingClientRect().width / progress.offsetWidth).to.be.closeTo(0.1, 0.002);
    });

    it('should set progress-value custom variable properly', () => {
      progress.value = 0.1;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.equal('0.1');
    });

    it('should have proper scale with custom min and max', () => {
      progress.max = 20;
      progress.min = 10;
      progress.value = 15;
      expect(value.getBoundingClientRect().width / progress.offsetWidth).to.be.closeTo(0.5, 0.002);
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.equal('0.5');
    });

    it('should set normalized value to 1 in case of wrong bounds', () => {
      progress.value = 10;
      progress.max = 12;
      progress.min = 13;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('1');
    });

    it('should set normalized value to 1 in case of equal bounds', () => {
      progress.value = 10;
      progress.max = 10;
      progress.min = 10;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('1');
    });

    it('should set normalized value to 0 if the value is undefined', () => {
      progress.value = undefined;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('0');
    });

    it('should set normalized value to 0.5 if the value is 0 and min is -1', () => {
      progress.min = -1;
      progress.value = 0;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('0.5');
    });

    it('should clamp normalized value between 0 and 1', () => {
      progress.value = -1;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('0');

      progress.value = 2;
      expect(getComputedStyle(progress).getPropertyValue('--vaadin-progress-value')).to.be.equal('1');
    });

    it('should set proper aria-valuenow on value change', () => {
      progress.max = 100;
      progress.value = 50;
      expect(progress.getAttribute('aria-valuenow')).to.equal('50');
    });

    it('should set proper aria-valuemin on min change', () => {
      progress.max = 100;
      progress.min = 10;
      expect(progress.getAttribute('aria-valuemin')).to.equal('10');
    });

    it('should set proper aria-valuemax on max change', () => {
      progress.max = 100;
      progress.min = 10;
      expect(progress.getAttribute('aria-valuemax')).to.equal('100');
    });

    it('should set indeterminate attribute', () => {
      progress.indeterminate = true;
      expect(progress.hasAttribute('indeterminate')).to.be.true;
    });
  });

  describe('inside column flexbox', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
          <vaadin-progress-bar></vaadin-progress-bar>
        </div>
      `);
      await nextRender();
      progress = layout.firstElementChild;
    });

    it('should have width of the parent', () => {
      expect(progress.offsetWidth).to.equal(layout.offsetWidth);
    });

    it('should not collapse', () => {
      expect(progress.offsetWidth).to.be.above(100);
    });
  });
});
