import { expect } from '@vaadin/chai-plugins';
import { emulateMedia, resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { aTimeout, escKeyDown, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-animated-overlay.js';

function fixtureMultiple() {
  const parent = fixtureSync(`
    <div>
      <mock-animated-overlay>
        <div>Overlay 1</div>
        <button>Go to overlay 2</button>
      </mock-animated-overlay>
      <mock-animated-overlay>
        <div>Overlay 2</div>
      </mock-animated-overlay>
    </div>
  `);

  const [overlay1, overlay2] = parent.children;

  overlay1.querySelector('button').addEventListener('click', () => {
    overlay1.opened = false;
    overlay2.opened = true;
  });

  return parent;
}

customElements.define(
  'animated-div',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            animation: 1ms div-dummy-animation;
          }

          @keyframes div-dummy-animation {
            to {
              opacity: 1 !important;
            }
          }
        </style>
        <slot></slot>
      `;
    }
  },
);

function afterOverlayOpeningFinished(overlay, callback) {
  const observer = new MutationObserver((mutations, observer) => {
    const isOverlayOpened = mutations.some(({ target }) => {
      return target.hasAttribute('opened') && !target.hasAttribute('opening');
    });

    if (isOverlayOpened) {
      observer.disconnect();
      requestAnimationFrame(() => {
        setTimeout(() => {
          callback();
        });
      });
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['opening'] });
}

function afterOverlayClosingFinished(overlay, callback) {
  const observer = new MutationObserver((mutations, observer) => {
    const isOverlayClosed = mutations.some(({ target }) => {
      return !target.hasAttribute('opened') && !target.hasAttribute('closing');
    });

    if (isOverlayClosed) {
      observer.disconnect();
      requestAnimationFrame(() => {
        setTimeout(() => {
          callback();
        });
      });
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['closing'] });
}

describe('overlay with zero-duration animation', () => {
  let overlay, owner;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>overlay content</mock-animated-overlay>');
    owner = fixtureSync('<div></div>');
    overlay.owner = owner;
    overlay.setAttribute('zero-duration-animation', '');
    await nextRender();
  });

  afterEach(() => {
    overlay.opened = false;
    sinon.restore();
  });

  it('should finish opening and closing synchronously', () => {
    const finishOpening = sinon.spy(overlay, '_finishOpening');
    const finishClosing = sinon.spy(overlay, '_finishClosing');

    expect(getComputedStyle(overlay).animationName).to.equal('overlay-dummy-animation');

    overlay.opened = true;

    expect(finishOpening).to.be.calledOnce;
    expect(overlay.hasAttribute('opening')).to.be.false;
    expect(owner.hasAttribute('opening')).to.be.false;

    overlay.opened = false;

    expect(finishClosing).to.be.calledOnce;
    expect(overlay.hasAttribute('closing')).to.be.false;
    expect(owner.hasAttribute('closing')).to.be.false;
  });
});

[false, true].forEach((withAnimation) => {
  const titleSuffix = withAnimation ? ' (animated)' : '';

  describe(`animated overlay${titleSuffix}`, () => {
    let overlay, owner;

    beforeEach(async () => {
      overlay = fixtureSync('<mock-animated-overlay>overlay content</mock-animated-overlay>');
      owner = fixtureSync('<div></div>');
      overlay.owner = owner;
      if (withAnimation) {
        overlay.setAttribute('animate', '');
      }
      await nextRender();
    });

    afterEach(() => {
      overlay.opened = false;
    });

    if (withAnimation) {
      it('should set opening attribute on the overlay when opened', () => {
        overlay.opened = true;

        expect(overlay.hasAttribute('opening')).to.be.true;
        expect(owner.hasAttribute('opening')).to.be.true;
      });

      it('should clear opening attribute on the overlay after it has opened', async () => {
        overlay.opened = true;

        await new Promise((resolve) => {
          afterOverlayOpeningFinished(overlay, resolve);
        });

        expect(overlay.hasAttribute('opening')).to.be.false;
        expect(owner.hasAttribute('opening')).to.be.false;
      });

      it('should clear opening attribute on the overlay if animation has been cancelled', async () => {
        overlay.opened = true;
        await oneEvent(overlay, 'animationstart');

        // Trigger animationcancel event
        overlay.parentElement.style.display = 'none';

        await new Promise((resolve) => {
          afterOverlayOpeningFinished(overlay, resolve);
        });

        expect(overlay.hasAttribute('opening')).to.be.false;
        expect(owner.hasAttribute('opening')).to.be.false;
      });

      it('should set closing attribute on the overlay when closed', async () => {
        overlay.opened = true;

        await new Promise((resolve) => {
          afterOverlayOpeningFinished(overlay, resolve);
        });

        overlay.opened = false;

        expect(overlay.hasAttribute('closing')).to.be.true;
        expect(owner.hasAttribute('closing')).to.be.true;
      });

      it('should clear closing attribute on the overlay after it has closed', async () => {
        overlay.opened = true;

        await new Promise((resolve) => {
          afterOverlayOpeningFinished(overlay, resolve);
        });

        overlay.opened = false;

        await new Promise((resolve) => {
          afterOverlayClosingFinished(overlay, resolve);
        });

        expect(overlay.hasAttribute('closing')).to.be.false;
        expect(owner.hasAttribute('closing')).to.be.false;
      });

      it('should clear closing attribute on the overlay if animation has been cancelled', async () => {
        overlay.opened = true;

        await new Promise((resolve) => {
          afterOverlayOpeningFinished(overlay, resolve);
        });

        overlay.opened = false;
        await oneEvent(overlay, 'animationstart');

        // Trigger animationcancel event
        overlay.parentElement.style.display = 'none';

        await new Promise((resolve) => {
          afterOverlayClosingFinished(overlay, resolve);
        });

        expect(overlay.hasAttribute('closing')).to.be.false;
        expect(owner.hasAttribute('closing')).to.be.false;
      });
    }

    it('should flush closing overlay when re-opened while closing animation is in progress', () => {
      overlay.opened = true;
      overlay._flushAnimation('opening');

      overlay.opened = false;

      overlay.opened = true;

      expect(overlay.hasAttribute('closing')).to.be.false;
    });

    it('should flush opening overlay when closed while opening animation is in progress', () => {
      overlay.opened = true;

      overlay.opened = false;

      expect(overlay.hasAttribute('opening')).to.be.false;
      expect(owner.hasAttribute('opening')).to.be.false;
    });

    it('should detach the overlay even if it is scheduled for reopening', () => {
      overlay.opened = true;

      overlay.opened = false;

      overlay.opened = true;

      overlay.opened = false;
      overlay._flushAnimation('closing');

      expect(overlay.parentNode).not.to.equal(document.body);
    });

    it('should not animate closing if the overlay is explicitly hidden', () => {
      overlay.opened = true;

      overlay.hidden = true;

      overlay.opened = false;

      expect(overlay.parentNode).not.to.equal(document.body);
    });

    it('should close the overlay if hidden is set while closing', () => {
      overlay.opened = true;

      overlay.opened = false;

      overlay.hidden = true;

      expect(overlay.parentNode).not.to.equal(document.body);
    });

    it('should close the overlay when ESC pressed while opening', () => {
      overlay.opened = true;
      escKeyDown(document.body);
      expect(overlay.opened).to.equal(false);
    });
  });

  describe(`switching two overlays${titleSuffix}`, () => {
    let wrapper, overlays;

    beforeEach((done) => {
      wrapper = fixtureMultiple();
      overlays = [...wrapper.children];
      if (withAnimation) {
        overlays.forEach((overlay) => overlay.setAttribute('animate', ''));
      }
      afterOverlayOpeningFinished(overlays[0], done);
      overlays[0].opened = true;
    });

    afterEach(() => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
    });

    it('should remove pointer events on previously opened overlay', (done) => {
      afterOverlayClosingFinished(overlays[0], () => {
        expect(overlays[0].$.overlay.style.pointerEvents).to.equal('');
        done();
      });
      overlays[0].querySelector('button').click();
    });
  });

  describe(`simultaneous opening${titleSuffix}`, () => {
    let wrapper, overlays;

    beforeEach(async () => {
      wrapper = fixtureMultiple();
      overlays = [...wrapper.children];
      await nextRender();
      if (withAnimation) {
        overlays.forEach((overlay) => overlay.setAttribute('animate', ''));
      }
    });

    afterEach(() => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
    });

    it('should not remove pointer events on last opened overlay', (done) => {
      afterOverlayOpeningFinished(overlays[1], () => {
        expect(overlays[0].$.overlay.style.pointerEvents).to.equal('none');
        expect(overlays[1].$.overlay.style.pointerEvents).to.equal('');
        done();
      });
      overlays[0].opened = true;
      overlays[1].opened = true;
    });
  });

  describe(`simultaneous closing${titleSuffix}`, () => {
    let wrapper, overlays;

    beforeEach(async () => {
      wrapper = fixtureMultiple();
      await nextRender();
      const third = document.createElement('mock-animated-overlay');
      wrapper.appendChild(third);
      overlays = [...wrapper.children];

      if (withAnimation) {
        overlays.forEach((overlay) => overlay.setAttribute('animate', ''));
      }
    });

    afterEach(() => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
    });

    it('should restore pointer events on the remaining overlay', (done) => {
      afterOverlayOpeningFinished(overlays[2], async () => {
        expect(overlays[0].$.overlay.style.pointerEvents).to.equal('none');
        overlays[1].opened = false;
        overlays[2].opened = false;
        await nextFrame();
        expect(overlays[0].$.overlay.style.pointerEvents).to.equal('');
        done();
      });
      overlays[0].opened = true;
      overlays[1].opened = true;
      overlays[2].opened = true;
    });
  });

  describe(`simultaneous opening with animated content${titleSuffix}`, () => {
    let wrapper, overlays;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <mock-animated-overlay>
            <div>Plain old content</div>
          </mock-animated-overlay>
          <mock-animated-overlay>
            <animated-div>Fancy content</animated-div>
          </mock-animated-overlay>
        </div>
      `);
      await nextRender();
      overlays = [...wrapper.children];
      if (withAnimation) {
        overlays.forEach((overlay) => {
          overlay.setAttribute('animate', '');
        });
      }
    });

    afterEach(() => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
    });

    it('should not remove pointer events on last opened overlay', (done) => {
      afterOverlayOpeningFinished(overlays[1], () => {
        expect(overlays[0].$.overlay.style.pointerEvents).to.equal('none');
        expect(overlays[1].$.overlay.style.pointerEvents).to.equal('');
        done();
      });
      overlays[0].opened = true;
      overlays[1].opened = true;
    });
  });
});

describe('interaction while closing', () => {
  let overlay, content, spy;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay><button>Overlay content</button></mock-animated-overlay>');
    overlay.setAttribute('long-animation', '');
    await nextRender();

    overlay.opened = true;
    await nextRender();
    overlay._flushAnimation('opening');

    content = overlay.querySelector('button');
    spy = sinon.spy();
    content.addEventListener('click', spy);
  });

  afterEach(async () => {
    overlay._flushAnimation('closing');
    await resetMouse();
  });

  it('should not allow pointer events on the overlay part while closing', () => {
    overlay.opened = false;

    expect(overlay.hasAttribute('closing')).to.be.true;
    expect(getComputedStyle(overlay.$.overlay).pointerEvents).to.equal('none');
  });

  it('should not dispatch click on the overlay content while closing', async () => {
    overlay.opened = false;

    await sendMouseToElement({ type: 'click', element: content });

    expect(spy).to.be.not.called;
  });

  it('should restore pointer events on the overlay part after closing', () => {
    overlay.opened = false;
    overlay._flushAnimation('closing');

    expect(overlay.hasAttribute('closing')).to.be.false;
    expect(getComputedStyle(overlay.$.overlay).pointerEvents).to.equal('auto');
  });
});

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

  describe('fill mode', () => {
    beforeEach(async () => {
      overlay.setAttribute('themed-parts', '');
      overlay.style.setProperty('--vaadin-overlay-animation-delay', '2s');
      await nextRender();
    });

    it('should apply the closed value during the opening animation delay', () => {
      overlay.opened = true;

      // The backwards fill keeps the overlay at its closed opacity for the delay,
      // instead of painting the theme value until the animation starts.
      expect(getComputedStyle(overlay.$.overlay).opacity).to.equal('0');
    });

    it('should apply the value of the part during the closing animation delay', () => {
      overlay.opened = true;
      overlay._flushAnimation('opening');
      overlay.opened = false;

      // The closing animation is reversed, so the fill applies the opened state. That state
      // is not declared in the keyframes, so the part keeps its own opacity and does not
      // jump to a different value before the closing animation starts.
      expect(getComputedStyle(overlay.$.overlay).opacity).to.equal('0.5');
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

describe('theme paint properties without an opted-in duration', () => {
  let overlay;

  // The paint properties a theme applies to the overlay parts. These must survive
  // the opening and closing windows of a host animation that does not opt in to
  // the overlay animation duration, e.g. a theme with its own `:host([opening])`
  // animation. See `animated-styles.js` for the values.
  const themedValues = {
    transform: 'matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)',
    translate: '11px 12px',
    scale: '0.75',
    opacity: '0.5',
  };

  function assertThemedValues(element) {
    const style = getComputedStyle(element);
    expect(style.transform).to.equal(themedValues.transform);
    expect(style.translate).to.equal(themedValues.translate);
    expect(style.scale).to.equal(themedValues.scale);
    expect(style.opacity).to.equal(themedValues.opacity);
  }

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>overlay content</mock-animated-overlay>');
    // A 5s animation on the host, while --vaadin-overlay-animation-duration stays 0s
    overlay.setAttribute('long-animation', '');
    overlay.setAttribute('themed-parts', '');
    overlay.withBackdrop = true;
    await nextRender();
  });

  afterEach(() => {
    overlay._flushAnimation('opening');
    overlay._flushAnimation('closing');
    overlay.opened = false;
  });

  it('should not override the overlay part paint properties while opening', () => {
    overlay.opened = true;

    expect(overlay.hasAttribute('opening')).to.be.true;
    assertThemedValues(overlay.$.overlay);
  });

  it('should not override the backdrop paint properties while opening', () => {
    overlay.opened = true;

    expect(overlay.hasAttribute('opening')).to.be.true;
    assertThemedValues(overlay.$.backdrop);
  });

  it('should not override the overlay part paint properties while closing', () => {
    overlay.opened = true;
    overlay._flushAnimation('opening');
    overlay.opened = false;

    expect(overlay.hasAttribute('closing')).to.be.true;
    assertThemedValues(overlay.$.overlay);
  });

  it('should not override the backdrop paint properties while closing', () => {
    overlay.opened = true;
    overlay._flushAnimation('opening');
    overlay.opened = false;

    expect(overlay.hasAttribute('closing')).to.be.true;
    assertThemedValues(overlay.$.backdrop);
  });
});
