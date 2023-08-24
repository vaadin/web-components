import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { createOverlay } from './helpers.js';

customElements.define(
  'two-overlays',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay opened="{{showOverlay1}}" renderer="[[renderer1]]"></vaadin-overlay>
        <vaadin-overlay opened="{{showOverlay2}}" renderer="[[renderer2]]"></vaadin-overlay>
      `;
    }

    static get properties() {
      return {
        showOverlay1: Boolean,
        showOverlay2: Boolean,
        renderer1: {
          type: Object,
          value: () => {
            return (root) => {
              if (!root.firstChild) {
                const div = document.createElement('div');
                div.textContent = 'Overlay 1';

                const button = document.createElement('button');
                button.textContent = 'Go to overlay 2';

                button.addEventListener('click', () => {
                  const host = root.__dataHost;
                  host.showOverlay1 = false;
                  host.showOverlay2 = true;
                });

                root.append(div, button);
              }
            };
          },
        },
        renderer2: {
          type: Object,
          value: () => {
            return (root) => {
              if (!root.firstChild) {
                const div = document.createElement('div');
                div.textContent = 'Overlay 2';
                root.appendChild(div);
              }
            };
          },
        },
      };
    }
  },
);

customElements.define(
  'animated-div',
  class extends PolymerElement {
    static get template() {
      return html`
        <style>
          :host {
            animation: 1ms div-dummy-animation;
          }

          @keyframes div-dummy-animation {
            to {
              opacity: 1 !important; /* stylelint-disable-line keyframe-declaration-no-important */
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
      afterNextRender(overlay, callback);
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
      afterNextRender(overlay, callback);
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

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
    });

    it('should flush closing overlay when re-opened while closing animation is in progress', async () => {
      overlay.opened = true;
      await nextRender();
      overlay._flushAnimation('opening');

      overlay.opened = false;
      await nextRender();

      overlay.opened = true;
      await nextRender();

      expect(overlay.hasAttribute('closing')).to.be.false;
    });

    it('should flush opening overlay when closed while opening animation is in progress', async () => {
      overlay.opened = true;
      await nextRender();

      overlay.opened = false;
      await nextRender();

      expect(overlay.hasAttribute('opening')).to.be.false;
    });

    it('should detach the overlay even if it is scheduled for reopening', async () => {
      overlay.opened = true;
      await nextRender();

      overlay.opened = false;
      await nextRender();

      overlay.opened = true;
      await nextRender();

      overlay.opened = false;
      await nextRender();
      overlay._flushAnimation('closing');

      expect(overlay.parentNode).not.to.equal(document.body);
    });

    it('should not animate closing if the overlay is explicitly hidden', async () => {
      overlay.opened = true;
      await nextRender();

      overlay.hidden = true;
      await nextRender();

      overlay.opened = false;
      await nextRender();

      expect(overlay.parentNode).not.to.equal(document.body);
    });

    it('should close the overlay if hidden is set while closing', async () => {
      overlay.opened = true;
      await nextRender();

      overlay.opened = false;
      await nextRender();

      overlay.hidden = true;
      await nextRender();

      expect(overlay.parentNode).not.to.equal(document.body);
    });

    it('should close the overlay when ESC pressed while opening', async () => {
      overlay.opened = true;
      await nextRender();
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

    afterEach(async () => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
      await nextRender();
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

    afterEach(async () => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
      await nextRender();
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

    afterEach(async () => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
      await nextRender();
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

    afterEach(async () => {
      overlays.forEach((overlay) => {
        overlay.opened = false;
      });
      await nextRender();
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
