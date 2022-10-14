import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

customElements.define(
  'overlay-props-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="overlay" opened="{{opened}}">
          <template>my-overlay-view content hostProp: {{hostProp}} hostPath.subPath: {{hostPath.subPath}}</template>
        </vaadin-overlay>
      `;
    }

    static get properties() {
      return {
        opened: Boolean,
        hostProp: {
          type: String,
          value: 'foo',
        },
        hostPath: {
          type: Object,
          value: () => {
            return { subPath: 'foo' };
          },
        },
      };
    }
  },
);

describe('overlay template', () => {
  let overlay;

  describe('in component scope', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = fixtureSync('<overlay-props-wrapper></overlay-props-wrapper>');
      overlay = wrapper.$.overlay;
      overlay.opened = true;
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should use overlay host for contents, slot in content part', () => {
      expect(overlay.content).to.equal(overlay);
      const contentSlot = overlay.$.content.querySelector('slot');
      expect(contentSlot).to.be.ok;
      expect(overlay.lastChild.assignedSlot).to.equal(contentSlot);
    });

    it('should stamp contents', () => {
      expect(overlay.content.textContent).to.contain('my-overlay-view content');
    });

    it('should forwardHostProp for props', () => {
      expect(overlay.content.textContent).to.contain('hostProp: foo');
      wrapper.hostProp = 'bar';
      expect(overlay.content.textContent).to.contain('hostProp: bar');
    });

    it('should forwardHostProp for paths', () => {
      expect(overlay.content.textContent).to.contain('hostPath.subPath: foo');
      wrapper.set('hostPath.subPath', 'bar');
      expect(overlay.content.textContent).to.contain('hostPath.subPath: bar');
    });
  });

  describe('in document scope', () => {
    beforeEach(() => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>plain overlay content</template>
        </vaadin-overlay>
      `);
    });

    beforeEach(() => {
      overlay.opened = true;
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should use overlay host for contents, slot in content part', () => {
      expect(overlay.content).to.equal(overlay);
      const contentSlot = overlay.$.content.querySelector('slot');
      expect(contentSlot).to.be.ok;
      expect(overlay.lastChild.assignedSlot).to.equal(contentSlot);
    });

    it('should stamp contents', () => {
      expect(overlay.content).to.be.ok;
      expect(overlay.content.textContent).to.contain('plain overlay content');
    });
  });
});
