import { expect } from '@esm-bundle/chai';
import { fixtureSync, isIOS } from '@vaadin/testing-helpers';
import '../src/vaadin-device-detector.js';

describe('device detector', () => {
  let detector;

  beforeEach(() => {
    detector = fixtureSync('<vaadin-device-detector></vaadin-device-detector>');
  });

  it('should detect wide screen', () => {
    expect(detector.wide).to.eql(!isIOS);
  });

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  (isSafari ? it.skip : it)('should detect touch support', () => {
    expect(detector.touch).to.eql(isIOS);
  });

  it('should detect phone', () => {
    expect(detector.phone).to.eql(isIOS);
  });
});
