import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { announce } from '../src/a11y-announcer.js';

describe('a11y announcer', () => {
  let region;

  beforeEach(() => {
    region = document.querySelector('[aria-live]');
  });

  describe('live region', () => {
    it('should create live region element and add it to body', () => {
      expect(region).to.be.an.instanceOf(HTMLDivElement);
      expect(region.parentNode).to.equal(document.body);
    });

    it('should set aria-live attribute to polite by default', () => {
      expect(region.getAttribute('aria-live')).to.equal('polite');
    });

    it('should apply styles to make live region visually hidden', () => {
      const style = getComputedStyle(region);
      expect(style.position).to.equal('fixed');
      expect(style.clip).to.equal('rect(0px, 0px, 0px, 0px)');
    });
  });

  describe('announce()', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should update region text content after the default timeout', () => {
      announce('Test', { mode: 'assertive' });
      expect(region.textContent).to.equal('');

      clock.tick(150);
      expect(region.textContent).to.equal('Test');
    });

    it('should use custom timeout when corresponding option is passed', () => {
      announce('Test', { timeout: 100 });
      expect(region.textContent).to.equal('');

      clock.tick(100);
      expect(region.textContent).to.equal('Test');
    });

    it('should update region aria-live attribute when mode is passed', () => {
      announce('Test', { mode: 'assertive' });
      expect(region.getAttribute('aria-live')).to.equal('assertive');
    });
  });
});
