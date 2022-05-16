import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-overlay.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-overlay',
  css`
    :host([animate][opening]),
    :host([animate][closing]) {
      animation: 50ms overlay-dummy-animation;
    }

    @keyframes overlay-dummy-animation {
      to {
        opacity: 1 !important; /* stylelint-disable-line keyframe-declaration-no-important */
      }
    }
  `,
);

customElements.define(
  'two-overlays',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay opened="{{showOverlay1}}">
          <template>
            <div>Overlay 1</div>
            <button on-click="_switchOverlays">Go to overlay 2</button>
          </template>
        </vaadin-overlay>
        <vaadin-overlay opened="{{showOverlay2}}">
          <template>
            <div>Overlay 2</div>
          </template>
        </vaadin-overlay>
      `;
    }

    static get properties() {
      return {
        showOverlay1: Boolean,
        showOverlay2: Boolean,
      };
    }

    _switchOverlays() {
      this.showOverlay1 = false;
      this.showOverlay2 = true;
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
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.attributeName === 'opening') {
        const target = mutation.target;
        const hasFinishedOpening = target.hasAttribute('opened') && !target.hasAttribute('opening');
        if (hasFinishedOpening) {
          observer.disconnect();
          afterNextRender(overlay, callback);
          return;
        }
      }
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['opening'] });
}

function afterOverlayClosingFinished(overlay, callback) {
  const observer = new MutationObserver((mutations, observer) => {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.attributeName === 'closing') {
        const target = mutation.target;
        const hasFinishedClosing = !target.hasAttribute('opened') && !target.hasAttribute('closing');
        if (hasFinishedClosing) {
          observer.disconnect();
          afterNextRender(overlay, callback);
          return;
        }
      }
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['closing'] });
}

[false, true].forEach((withAnimation) => {
  const titleSuffix = withAnimation ? ' (animated)' : '';

  describe(`animated overlay${titleSuffix}`, () => {
    let overlay;

    beforeEach(() => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            overlay-content
          </template>
        </vaadin-overlay>
      `);
      if (withAnimation) {
        overlay.setAttribute('animate', '');
      }
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
      overlays[0].content.querySelector('button').click();
    });
  });

  describe(`simultaneous opening${titleSuffix}`, () => {
    let wrapper, overlays;

    beforeEach(() => {
      wrapper = fixtureSync('<two-overlays><two-overlays>');
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

    beforeEach(() => {
      wrapper = fixtureSync('<two-overlays><two-overlays>');
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
      afterOverlayOpeningFinished(overlays[2], () => {
        expect(overlays[0].$.overlay.style.pointerEvents).to.equal('none');
        overlays[1].opened = false;
        overlays[2].opened = false;
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

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-overlay>
            <template>
              <div>Plain old content</div>
            </template>
          </vaadin-overlay>
          <vaadin-overlay>
            <template>
              <animated-div>Fancy content</animated-div>
            </template>
          </vaadin-overlay>
        </div>
      `);
      overlays = Array.from(wrapper.querySelectorAll('vaadin-overlay'));
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
