import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

customElements.define(
  'overlay-opened-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="overlay" opened>
          <template>overlay content</template>
        </vaadin-overlay>
      `;
    }
  },
);

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

function createTemplate(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}

describe('overlay template', () => {
  let overlay;
  let externalTemplate;

  describe('template with initially opened overlay', () => {
    let wrapper, overlay;

    beforeEach(() => {
      wrapper = fixtureSync('<overlay-opened-wrapper></overlay-opened-wrapper>');
      overlay = wrapper.$.overlay;
    });

    it('should use content part shadowRoot for contents when initially opened in component scope', () => {
      expect(overlay.content).to.be.instanceOf(ShadowRoot);
    });
  });

  describe('in component scope', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = fixtureSync('<overlay-props-wrapper></overlay-props-wrapper>');
      overlay = wrapper.$.overlay;
      externalTemplate = createTemplate('external template content');
    });

    describe('child template', () => {
      beforeEach(() => {
        overlay.opened = true;
      });

      afterEach(() => {
        overlay.opened = false;
      });

      it('should use child template by default', () => {
        const childTemplate = overlay.querySelector('template');
        expect(childTemplate).to.be.ok;
        expect(overlay.template).to.equal(childTemplate);
      });

      it('should use content part shadowRoot for contents', () => {
        expect(overlay.content).to.equal(overlay.$.content.shadowRoot);
      });

      it('should stamp contents', () => {
        expect(overlay.content).to.be.ok;
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

    describe('external template disconnected', () => {
      beforeEach(() => {
        overlay.template = externalTemplate;
        overlay.opened = true;
      });

      afterEach(() => {
        overlay.opened = false;
      });

      it('should use content part shadowRoot for contents', () => {
        expect(overlay.content).to.equal(overlay.$.content.shadowRoot);
      });

      it('should stamp contents', () => {
        expect(overlay.content).to.be.ok;
        expect(overlay.content.textContent).to.contain('external template content');
      });

      it('should not use default child template', () => {
        expect(overlay.content.textContent).to.not.contain('my-overlay-view content');
      });
    });

    describe('external template connected in document scope', () => {
      beforeEach(() => {
        document.body.appendChild(externalTemplate);
        overlay.template = externalTemplate;
        overlay.opened = true;
      });

      afterEach(() => {
        overlay.opened = false;
        document.body.removeChild(externalTemplate);
      });

      it('should use overlay host for contents, slot in content part', () => {
        expect(overlay.content).to.equal(overlay);
        const contentSlot = overlay.$.content.querySelector('slot');
        expect(contentSlot).to.be.ok;
        expect(overlay.lastChild.assignedSlot).to.equal(contentSlot);
      });

      it('should stamp contents', () => {
        expect(overlay.content).to.be.ok;
        expect(overlay.content.textContent).to.contain('external template content');
      });

      it('should not use default child template', () => {
        expect(overlay.content.textContent).to.not.contain('my-overlay-view content');
      });
    });
  });

  describe('in document scope', () => {
    beforeEach(() => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>plain overlay content</template>
        </vaadin-overlay>
      `);
      externalTemplate = createTemplate('external template content');
    });

    describe('child template', () => {
      beforeEach(() => {
        overlay.opened = true;
      });

      afterEach(() => {
        overlay.opened = false;
      });

      it('should use child template by default', () => {
        const childTemplate = overlay.querySelector('template');
        expect(childTemplate).to.be.ok;
        expect(overlay.template).to.equal(childTemplate);
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

    describe('external template disconnected', () => {
      beforeEach(() => {
        overlay.template = externalTemplate;
        overlay.opened = true;
      });

      afterEach(() => {
        overlay.opened = false;
      });

      it('should use content part shadowRoot for contents', () => {
        expect(overlay.content).to.equal(overlay.$.content.shadowRoot);
      });

      it('should stamp contents', () => {
        expect(overlay.content).to.be.ok;
        expect(overlay.content.textContent).to.contain('external template content');
      });

      it('should not use default child template', () => {
        expect(overlay.content.textContent).to.not.contain('plain overlay content');
      });
    });

    describe('external template connected in component scope', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = fixtureSync('<overlay-props-wrapper></overlay-props-wrapper>');
        wrapper.shadowRoot.appendChild(externalTemplate);
        overlay.template = externalTemplate;
        overlay.opened = true;
      });

      afterEach(() => {
        overlay.opened = false;
      });

      it('should use content part shadowRoot for contents', () => {
        expect(overlay.content).to.equal(overlay.$.content.shadowRoot);
      });

      it('should stamp contents', () => {
        expect(overlay.content).to.be.ok;
        expect(overlay.content.textContent).to.contain('external template content');
      });

      it('should not use default child template', () => {
        expect(overlay.content.textContent).to.not.contain('plain overlay content');
      });
    });
  });
});
