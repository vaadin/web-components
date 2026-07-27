import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import { shouldAnimate } from '../src/vaadin-overlay-utils.js';

describe('shouldAnimate', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<div></div>');
  });

  it('should return false when the element is not rendered', () => {
    element.style.animation = 'foo 1s';
    element.style.display = 'none';
    expect(shouldAnimate(element)).to.be.false;
  });

  it('should return false when the element has no animation name', () => {
    element.style.animationDuration = '1s';
    expect(shouldAnimate(element)).to.be.false;
  });

  it('should return false when the animation duration is zero', () => {
    element.style.animation = 'foo 0s';
    expect(shouldAnimate(element)).to.be.false;
  });

  it('should return true when one of the animation durations is not zero', () => {
    element.style.animationName = 'foo, bar';
    element.style.animationDuration = '0s, 1s';
    expect(shouldAnimate(element)).to.be.true;
  });
});
