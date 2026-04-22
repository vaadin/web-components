import { expect } from '@vaadin/chai-plugins';
import '../src/styles/style-props.js';

describe('style-props', () => {
  describe('icon tokens', () => {
    it('should expose --_vaadin-icon-chevron-right as a non-empty url() value', () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--_vaadin-icon-chevron-right').trim();
      expect(value).to.not.be.empty;
      expect(value.startsWith('url(')).to.be.true;
    });

    it('should preserve the existing --_vaadin-icon-chevron-down token', () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--_vaadin-icon-chevron-down').trim();
      expect(value).to.not.be.empty;
      expect(value.startsWith('url(')).to.be.true;
      // The chevron-down path data must remain untouched.
      expect(value).to.include('m6 9 6 6 6-6');
    });
  });
});
