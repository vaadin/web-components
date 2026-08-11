import { expect } from '@vaadin/chai-plugins';
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

      it('should not run the animation callback again after the animation has finished', async () => {
        overlay.opened = true;

        await new Promise((resolve) => {
          afterOverlayOpeningFinished(overlay, resolve);
        });

        const spy = sinon.spy(overlay, '_finishOpening');
        overlay._flushAnimation('opening');

        expect(spy).to.be.not.called;
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

      expect(overlay.matches(':popover-open')).to.be.false;
    });

    it('should not animate closing if the overlay is explicitly hidden', () => {
      overlay.opened = true;

      overlay.hidden = true;

      overlay.opened = false;

      expect(overlay.hasAttribute('closing')).to.be.false;
      expect(overlay.matches(':popover-open')).to.be.false;
    });

    it('should close the overlay if hidden is set while closing', () => {
      overlay.opened = true;

      overlay.opened = false;

      overlay.hidden = true;

      expect(overlay.hasAttribute('closing')).to.be.false;
      expect(overlay.matches(':popover-open')).to.be.false;
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

    it('should not remove pointer events on last opened overlay with animated content', (done) => {
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

describe('content animation', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync(`
      <mock-animated-overlay long-animation>
        <animated-div>Fancy content</animated-div>
      </mock-animated-overlay>
    `);
    await nextRender();
  });

  afterEach(() => {
    overlay._flushAnimation('opening');
    overlay.opened = false;
  });

  it('should not finish the overlay animation when the content animation ends', async () => {
    overlay.opened = true;

    // The content animation is much shorter than the overlay animation, so the first
    // `animationend` bubbling to the overlay is the one from the content
    await oneEvent(overlay, 'animationend');

    expect(overlay.hasAttribute('opening')).to.be.true;
  });
});

describe('zero-duration animation', () => {
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

describe('animation objects', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>overlay content</mock-animated-overlay>');
    await nextRender();
  });

  afterEach(() => {
    overlay._flushAnimation('opening');
    overlay.opened = false;
    overlay._flushAnimation('closing');
  });

  describe('keyframes that do not exist', () => {
    beforeEach(() => {
      overlay.style.animationName = 'does-not-exist';
      overlay.style.animationDuration = '10s';
    });

    it('should not wait for the opening animation', () => {
      overlay.opened = true;

      expect(overlay.hasAttribute('opening')).to.be.false;
    });

    it('should not wait for the closing animation', () => {
      overlay.opened = true;
      overlay.opened = false;

      expect(overlay.hasAttribute('closing')).to.be.false;
      expect(overlay.matches(':popover-open')).to.be.false;
    });
  });

  describe('animations that do not report the state', () => {
    it('should not wait for a transition on the overlay', () => {
      overlay.setAttribute('theme-transition', '');
      expect(getComputedStyle(overlay).transitionDuration).to.equal('5s');

      overlay.opened = true;

      expect(overlay.hasAttribute('opening')).to.be.false;
    });

    it('should not wait for a content animation that outlives the overlay animation', async () => {
      overlay.setAttribute('animate', '');

      const div = document.createElement('div');
      div.classList.add('slow-content');
      overlay.appendChild(div);

      overlay.opened = true;
      expect(div.getAnimations()).to.have.lengthOf(1);

      await oneEvent(overlay, 'animationend');
      await nextFrame();

      expect(div.getAnimations()).to.have.lengthOf(1);
      expect(overlay.hasAttribute('opening')).to.be.false;
    });
  });

  describe('long animation', () => {
    beforeEach(() => {
      overlay.setAttribute('long-animation', '');
    });

    it('should wait for the closing animation when closed while opening', () => {
      overlay.opened = true;
      overlay.opened = false;

      expect(overlay.hasAttribute('closing')).to.be.true;
    });

    it('should stay open when reopened while the closing animation runs', async () => {
      overlay.opened = true;
      overlay._flushAnimation('opening');
      overlay.opened = false;
      overlay.opened = true;
      await aTimeout(100);

      expect(overlay.hasAttribute('closing')).to.be.false;
      expect(overlay.matches(':popover-open')).to.be.true;
    });
  });

  describe('short animation', () => {
    beforeEach(() => {
      overlay.setAttribute('animate', '');
    });

    it('should not fire closed again when the flushed closing animation settles', async () => {
      overlay.opened = true;
      overlay._flushAnimation('opening');
      overlay.opened = false;
      overlay._flushAnimation('closing');

      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-closed', spy);
      // Longer than the animation, so its promise has settled either way
      await aTimeout(100);

      expect(spy).to.be.not.called;
    });
  });

  describe('multiple animations', () => {
    beforeEach(() => {
      overlay.setAttribute('multiple-animations', '');
    });

    it('should wait for the longest animation', async () => {
      overlay.opened = true;
      expect(overlay.getAnimations()).to.have.lengthOf(2);

      // The 50ms animation ends first, while the 5s one is still running
      await oneEvent(overlay, 'animationend');
      await nextFrame();

      expect(overlay.hasAttribute('opening')).to.be.true;
    });
  });
});
