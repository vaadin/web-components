import { expect } from '@vaadin/chai-plugins';
import { escKeyDown, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './animated-styles.js';
import '../src/vaadin-overlay.js';
import { createOverlay } from './helpers.js';

customElements.define(
  'two-overlays',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      const overlay1 = document.createElement('vaadin-overlay');
      const overlay2 = document.createElement('vaadin-overlay');

      overlay1.renderer = (root) => {
        if (!root.firstChild) {
          const div = document.createElement('div');
          div.textContent = 'Overlay 1';

          const button = document.createElement('button');
          button.textContent = 'Go to overlay 2';

          button.addEventListener('click', () => {
            overlay1.opened = false;
            overlay2.opened = true;
          });

          root.append(div, button);
        }
      };

      overlay2.renderer2 = (root) => {
        if (!root.firstChild) {
          const div = document.createElement('div');
          div.textContent = 'Overlay 2';
          root.appendChild(div);
        }
      };

      this.shadowRoot.append(overlay1, overlay2);
    }
  },
);

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
    overlay = createOverlay('overlay content');
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
      overlay = createOverlay('overlay content');
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
      wrapper = fixtureSync('<two-overlays><two-overlays>');
      overlays = Array.from(wrapper.shadowRoot.querySelectorAll('vaadin-overlay'));
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
      wrapper = fixtureSync('<two-overlays><two-overlays>');
      await nextRender();
      overlays = Array.from(wrapper.shadowRoot.querySelectorAll('vaadin-overlay'));
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
      wrapper = fixtureSync('<two-overlays><two-overlays>');
      await nextRender();
      const third = document.createElement('vaadin-overlay');
      wrapper.shadowRoot.appendChild(third);
      overlays = Array.from(wrapper.shadowRoot.querySelectorAll('vaadin-overlay'));

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
          <vaadin-overlay></vaadin-overlay>
          <vaadin-overlay></vaadin-overlay>
        </div>
      `);
      await nextRender();
      overlays = Array.from(wrapper.querySelectorAll('vaadin-overlay'));
      overlays[0].renderer = (root) => {
        if (!root.firstChild) {
          const div = document.createElement('div');
          div.textContent = 'Plain old content';
          root.appendChild(div);
        }
      };
      overlays[1].renderer = (root) => {
        if (!root.firstChild) {
          const div = document.createElement('animated-div');
          div.textContent = 'Fancy content';
          root.appendChild(div);
        }
      };
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

function getAnimation(element, name) {
  return element.getAnimations().find((animation) => animation.animationName === name);
}

describe('animation properties', () => {
  let overlay;

  beforeEach(async () => {
    overlay = createOverlay('overlay content');
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

  it('should use closed and opened opacity for the fade animation', () => {
    overlay.style.setProperty('--vaadin-overlay-opacity-closed', '0.25');
    overlay.style.setProperty('--vaadin-overlay-opacity-opened', '0.75');

    overlay.opened = true;
    const keyframes = getAnimation(overlay.$.overlay, '--fade').effect.getKeyframes();
    expect(keyframes[0].opacity).to.equal('0.25');
    expect(keyframes[1].opacity).to.equal('0.75');
  });

  it('should use closed and opened translate for the transform animation', () => {
    overlay.style.setProperty('--vaadin-overlay-translate-closed', '10px 20px');
    overlay.style.setProperty('--vaadin-overlay-translate-opened', '30px 40px');

    overlay.opened = true;
    const keyframes = getAnimation(overlay.$.overlay, '--transform').effect.getKeyframes();
    expect(keyframes[0].translate).to.equal('10px 20px');
    expect(keyframes[1].translate).to.equal('30px 40px');
  });

  it('should use closed and opened scale for the transform animation', () => {
    overlay.style.setProperty('--vaadin-overlay-scale-closed', '0.5');
    overlay.style.setProperty('--vaadin-overlay-scale-opened', '1.5');

    overlay.opened = true;
    const keyframes = getAnimation(overlay.$.overlay, '--transform').effect.getKeyframes();
    expect(keyframes[0].scale).to.equal('0.5');
    expect(keyframes[1].scale).to.equal('1.5');
  });

  it('should use closed and opened transform for the transform animation', () => {
    overlay.style.setProperty('--vaadin-overlay-transform-closed', 'rotate(10deg)');
    overlay.style.setProperty('--vaadin-overlay-transform-opened', 'rotate(20deg)');

    overlay.opened = true;
    const keyframes = getAnimation(overlay.$.overlay, '--transform').effect.getKeyframes();
    expect(keyframes[0].transform).to.equal('rotate(10deg)');
    expect(keyframes[1].transform).to.equal('rotate(20deg)');
  });
});
