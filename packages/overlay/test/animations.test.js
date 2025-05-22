import { expect } from '@vaadin/chai-plugins';
import { escKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
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

[false, true].forEach((withAnimation) => {
  const titleSuffix = withAnimation ? ' (animated)' : '';

  describe(`animated overlay${titleSuffix}`, () => {
    let overlay;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      if (withAnimation) {
        overlay.setAttribute('animate', '');
      }
      await nextRender();
    });

    afterEach(() => {
      overlay.opened = false;
    });

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
