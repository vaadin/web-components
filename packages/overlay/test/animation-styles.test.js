import { expect } from '@vaadin/chai-plugins';
import { emulateMedia } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import './fixtures/mock-animated-overlay.js';

function getAnimation(element, name) {
  return element.getAnimations().find((animation) => animation.animationName === name);
}

/**
 * Returns the styles of the element at the given time of the named animation. The animated
 * value is read instead of the keyframes, because WebKit does not substitute `var()` in the
 * keyframes returned by `getAnimations()` when a keyframe is left out of the animation.
 */
function stylesDuringAnimation(element, name, time) {
  const animation = getAnimation(element, name);
  animation.pause();
  animation.currentTime = time;
  return getComputedStyle(element);
}

/** Returns the value the browser computes for the given style, to compare animated values against. */
function computedValue(property, value) {
  const element = fixtureSync('<div></div>');
  element.style.setProperty(property, value);
  return getComputedStyle(element)[property];
}

describe('animation properties', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>overlay content</mock-animated-overlay>');
    overlay.style.setProperty('--vaadin-overlay-animation-duration', '10s');
    await nextRender();
  });

  afterEach(() => {
    overlay._flushAnimation('opening');
    overlay._flushAnimation('closing');
    overlay.opened = false;
  });

  it('should set opening and closing attributes when animation duration is not 0s', () => {
    overlay.opened = true;
    expect(overlay.hasAttribute('opening')).to.be.true;

    overlay._flushAnimation('opening');
    overlay.opened = false;
    expect(overlay.hasAttribute('closing')).to.be.true;
  });

  // The empty keyframe animation on the host is what reports the end of the animation, so
  // these do not flush: they verify that the attributes are cleared on their own.
  it('should clear the opening attribute when the animation ends', async () => {
    overlay.style.setProperty('--vaadin-overlay-animation-duration', '50ms');

    overlay.opened = true;
    expect(overlay.hasAttribute('opening')).to.be.true;

    await oneEvent(overlay, 'animationend');
    expect(overlay.hasAttribute('opening')).to.be.false;
  });

  it('should clear the closing attribute when the animation ends', async () => {
    overlay.style.setProperty('--vaadin-overlay-animation-duration', '50ms');

    overlay.opened = true;
    // Let the opening animation run out, so that closing starts from a fully opened overlay
    await aTimeout(100);

    overlay.opened = false;
    expect(overlay.hasAttribute('closing')).to.be.true;

    await oneEvent(overlay, 'animationend');
    expect(overlay.hasAttribute('closing')).to.be.false;
  });

  it('should use animation duration and delay for opening and closing animations', () => {
    overlay.style.setProperty('--vaadin-overlay-animation-delay', '2s');

    overlay.opened = true;
    let timing = getAnimation(overlay.$.overlay, '--fade').effect.getTiming();
    expect(timing.duration).to.equal(10000);
    expect(timing.delay).to.equal(2000);

    overlay._flushAnimation('opening');
    overlay.opened = false;
    timing = getAnimation(overlay.$.overlay, '--fade').effect.getTiming();
    expect(timing.duration).to.equal(10000);
    expect(timing.delay).to.equal(2000);
  });

  it('should use animation timing function for opening and closing animations', () => {
    overlay.style.setProperty('--vaadin-overlay-animation-timing-function', 'linear');

    overlay.opened = true;
    expect(getAnimation(overlay.$.overlay, '--fade').effect.getTiming().easing).to.equal('linear');

    overlay._flushAnimation('opening');
    overlay.opened = false;
    expect(getAnimation(overlay.$.overlay, '--fade').effect.getTiming().easing).to.equal('linear');
  });

  // The animations start at the closed value and end at the value of the part, because the
  // opened state is left out of the keyframes. With a linear timing function the value in the
  // middle of the animation is exactly between the two, which pins down both ends.
  it('should use the closed opacity for the fade animation', () => {
    overlay.style.setProperty('--vaadin-overlay-opacity-closed', '0.25');
    overlay.style.setProperty('--vaadin-overlay-animation-timing-function', 'linear');
    overlay.$.overlay.style.opacity = '0.6';

    overlay.opened = true;
    expect(stylesDuringAnimation(overlay.$.overlay, '--fade', 0).opacity).to.equal('0.25');
    expect(stylesDuringAnimation(overlay.$.overlay, '--fade', 5000).opacity).to.equal('0.425');
  });

  it('should use the closed translate for the transform animation', () => {
    overlay.style.setProperty('--vaadin-overlay-translate-closed', '10px 20px');
    overlay.style.setProperty('--vaadin-overlay-animation-timing-function', 'linear');
    overlay.$.overlay.style.translate = '30px 40px';

    overlay.opened = true;
    expect(stylesDuringAnimation(overlay.$.overlay, '--transform', 0).translate).to.equal('10px 20px');
    expect(stylesDuringAnimation(overlay.$.overlay, '--transform', 5000).translate).to.equal('20px 30px');
  });

  it('should use the closed scale for the transform animation', () => {
    overlay.style.setProperty('--vaadin-overlay-scale-closed', '0.5');
    overlay.style.setProperty('--vaadin-overlay-animation-timing-function', 'linear');
    overlay.$.overlay.style.scale = '1.5';

    overlay.opened = true;
    expect(stylesDuringAnimation(overlay.$.overlay, '--transform', 0).scale).to.equal('0.5');
    expect(stylesDuringAnimation(overlay.$.overlay, '--transform', 5000).scale).to.equal('1');
  });

  it('should use the closed transform for the transform animation', () => {
    overlay.style.setProperty('--vaadin-overlay-transform-closed', 'rotate(10deg)');
    overlay.style.setProperty('--vaadin-overlay-animation-timing-function', 'linear');
    overlay.$.overlay.style.transform = 'rotate(20deg)';

    overlay.opened = true;
    expect(stylesDuringAnimation(overlay.$.overlay, '--transform', 0).transform).to.equal(
      computedValue('transform', 'rotate(10deg)'),
    );
    expect(stylesDuringAnimation(overlay.$.overlay, '--transform', 5000).transform).to.equal(
      computedValue('transform', 'rotate(15deg)'),
    );
  });

  it('should reverse the animation direction while closing', () => {
    overlay.opened = true;
    expect(getAnimation(overlay.$.overlay, '--fade').effect.getTiming().direction).to.equal('normal');

    overlay._flushAnimation('opening');
    overlay.opened = false;
    expect(getAnimation(overlay.$.overlay, '--fade').effect.getTiming().direction).to.equal('reverse');
  });

  describe('backdrop', () => {
    beforeEach(async () => {
      overlay.withBackdrop = true;
      await nextRender();
    });

    it('should only run the fade animation on the backdrop', () => {
      overlay.opened = true;
      const names = overlay.$.backdrop.getAnimations().map((animation) => animation.animationName);
      expect(names).to.eql(['--fade']);
    });

    it('should use linear timing function for the backdrop animation', () => {
      overlay.style.setProperty('--vaadin-overlay-animation-timing-function', 'ease-in');

      overlay.opened = true;
      expect(getAnimation(overlay.$.backdrop, '--fade').effect.getTiming().easing).to.equal('linear');
    });

    it('should always use zero closed opacity for the backdrop animation', () => {
      overlay.style.setProperty('--vaadin-overlay-opacity-closed', '0.25');

      overlay.opened = true;
      const keyframes = getAnimation(overlay.$.backdrop, '--fade').effect.getKeyframes();
      expect(keyframes[0].opacity).to.equal('0');
      expect(keyframes[1].opacity).to.equal('1');
    });

    it('should reverse the backdrop animation direction while closing', () => {
      overlay.opened = true;
      expect(getAnimation(overlay.$.backdrop, '--fade').effect.getTiming().direction).to.equal('normal');

      overlay._flushAnimation('opening');
      overlay.opened = false;
      expect(getAnimation(overlay.$.backdrop, '--fade').effect.getTiming().direction).to.equal('reverse');
    });
  });

  describe('prefers-reduced-motion', () => {
    before(async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
    });

    after(async () => {
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    it('should only run the fade animation on the overlay part', () => {
      overlay.opened = true;
      const names = overlay.$.overlay.getAnimations().map((animation) => animation.animationName);
      expect(names).to.eql(['--fade']);
    });
  });

  describe('fill outside the active animation', () => {
    beforeEach(async () => {
      overlay.setAttribute('themed-parts', '');
      overlay.style.setProperty('--vaadin-overlay-animation-delay', '2s');
      await nextRender();
    });

    it('should apply the closed value while opening', () => {
      overlay.opened = true;

      // The backwards fill keeps the overlay at its closed opacity for the delay,
      // instead of painting the theme value until the animation starts.
      expect(getComputedStyle(overlay.$.overlay).opacity).to.equal('0');
    });

    it('should apply the value of the part while closing', () => {
      overlay.opened = true;
      overlay._flushAnimation('opening');
      overlay.opened = false;

      // The closing animation is reversed, so the fill applies the opened state. That state
      // is not declared in the keyframes, so the part keeps its own opacity and does not
      // jump to a different value before the closing animation starts.
      expect(getComputedStyle(overlay.$.overlay).opacity).to.equal('0.5');
    });

    it('should keep the closed value after the closing animation ends', () => {
      overlay.opened = true;
      overlay._flushAnimation('opening');
      overlay.opened = false;

      // Pause first so that reaching the end does not finish the animation and end the state
      const animation = getAnimation(overlay.$.overlay, '--fade');
      animation.pause();
      animation.currentTime = 12000;

      // The part must not return to its own opacity while the overlay is still closing
      expect(overlay.hasAttribute('closing')).to.be.true;
      expect(getComputedStyle(overlay.$.overlay).opacity).to.equal('0');
    });
  });
});

describe('animation delay without duration', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>overlay content</mock-animated-overlay>');
    overlay.style.setProperty('--vaadin-overlay-animation-delay', '2s');
    await nextRender();
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should not set opening attribute when animation duration is 0s', () => {
    overlay.opened = true;
    expect(overlay.hasAttribute('opening')).to.be.false;
  });

  it('should not set closing attribute when animation duration is 0s', () => {
    overlay.opened = true;
    overlay.opened = false;
    expect(overlay.hasAttribute('closing')).to.be.false;
  });
});
