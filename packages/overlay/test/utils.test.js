import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import { getStateAnimations, shouldAnimate } from '../src/vaadin-overlay-utils.js';

const styles = document.createElement('style');
styles.textContent = `
  @keyframes utils-fade { to { opacity: 0.5; } }
  @keyframes utils-scale { to { scale: 0.5; } }
`;
document.head.appendChild(styles);

describe('getStateAnimations', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<div>content</div>');
  });

  it('should return an empty list when the element is not rendered', () => {
    element.style.animation = 'utils-fade 1s';
    element.style.display = 'none';
    expect(getStateAnimations(element)).to.be.empty;
  });

  it('should return an empty list when the element has no animation name', () => {
    element.style.animationDuration = '1s';
    expect(getStateAnimations(element)).to.be.empty;
  });

  it('should return an empty list when the animation duration is zero', () => {
    element.style.animation = 'utils-fade 0s';
    expect(getStateAnimations(element)).to.be.empty;
  });

  it('should return an empty list when the keyframes do not exist', () => {
    element.style.animation = 'utils-does-not-exist 1s';
    expect(getComputedStyle(element).animationName).to.equal('utils-does-not-exist');
    expect(getStateAnimations(element)).to.be.empty;
  });

  it('should return the animations that take time', () => {
    element.style.animationName = 'utils-fade, utils-scale';
    element.style.animationDuration = '0s, 1s';

    const animations = getStateAnimations(element);
    expect(animations.map((animation) => animation.animationName)).to.eql(['utils-scale']);
  });

  it('should return an empty list for a transition', () => {
    element.style.transition = 'opacity 1s';
    // The transition only starts from a value the browser has already resolved
    expect(getComputedStyle(element).opacity).to.equal('1');
    element.style.opacity = '0.5';

    expect(element.getAnimations()).to.have.lengthOf(1);
    expect(getStateAnimations(element)).to.be.empty;
  });

  it('should leave out the animations of the content', () => {
    const child = document.createElement('div');
    child.style.animation = 'utils-fade 1s';
    element.appendChild(child);
    expect(getStateAnimations(element)).to.be.empty;
  });
});

describe('shouldAnimate', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<div></div>');
  });

  it('should return false when the element is not rendered', () => {
    element.style.animation = 'utils-fade 1s';
    element.style.display = 'none';
    expect(shouldAnimate(element)).to.be.false;
  });

  it('should return false when the element has no animation name', () => {
    element.style.animationDuration = '1s';
    expect(shouldAnimate(element)).to.be.false;
  });

  it('should return false when the animation duration is zero', () => {
    element.style.animation = 'utils-fade 0s';
    expect(shouldAnimate(element)).to.be.false;
  });

  it('should return true when one of the animation durations is not zero', () => {
    element.style.animationName = 'utils-fade, utils-scale';
    element.style.animationDuration = '0s, 1s';
    expect(shouldAnimate(element)).to.be.true;
  });
});
