import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { announce } from '../src/announce.js';

describe('announce', () => {
  let region;

  before(() => {
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
      announce('Test');
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

    it('should use zero timeout when corresponding option is passed', () => {
      announce('Test', { timeout: 0 });
      expect(region.textContent).to.equal('');

      clock.tick(0);
      expect(region.textContent).to.equal('Test');
    });

    it('should update region aria-live attribute when mode is passed', () => {
      announce('Test', { mode: 'assertive' });
      expect(region.getAttribute('aria-live')).to.equal('assertive');
    });

    it('should clear region aria-live attribute when mode is alert', () => {
      announce('Test', { mode: 'alert' });
      expect(region.hasAttribute('aria-live')).to.be.false;
    });

    it('should update region role attribute when mode is alert', () => {
      announce('Test', { mode: 'alert' });
      clock.tick(100);
      expect(region.getAttribute('role')).to.equal('alert');
    });

    it('should not update region role attribute synchronously when mode is alert', () => {
      announce('Test', { mode: 'alert' });
      expect(region.hasAttribute('role')).to.be.false;
    });

    it('should restore region aria-live attribute', () => {
      announce('Test', { mode: 'alert' });
      announce('Test', { mode: 'assertive' });
      expect(region.getAttribute('aria-live')).to.equal('assertive');
    });

    it('should clear region role attribute', () => {
      announce('Test', { mode: 'alert' });
      clock.tick(100);
      announce('Test', { mode: 'assertive' });
      expect(region.hasAttribute('role')).to.be.false;
    });

    it('should not set region role back to alert', () => {
      announce('Test', { mode: 'alert' });
      announce('Test', { mode: 'assertive' });
      clock.tick(100);
      expect(region.hasAttribute('role')).to.be.false;
    });
  });
});
