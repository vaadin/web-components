import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { processTemplates } from '../src/templates.js';

class ComponentElement extends PolymerElement {
  static get is() {
    return 'component-element';
  }

  ready() {
    super.ready();

    processTemplates(this);
  }
}

customElements.define(ComponentElement.is, ComponentElement);

describe('process templates', () => {
  beforeEach(() => {
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  describe('with template renderer', () => {
    beforeEach(() => {
      window.Vaadin = window.Vaadin || {};
      window.Vaadin.templateRendererCallback = sinon.spy();
    });

    afterEach(() => {
      window.Vaadin.templateRendererCallback = undefined;
    });

    it('should invoke the template renderer callback', () => {
      const component = fixtureSync(`
        <component-element>
          <template></template>
        </component-element>
      `);

      expect(window.Vaadin.templateRendererCallback.calledOnce).to.be.true;
      expect(window.Vaadin.templateRendererCallback.args[0][0]).to.equal(component);
    });

    it('should not show the deprecation warning', () => {
      expect(console.warn.called).to.be.false;
    });
  });

  describe('without template renderer', () => {
    it('should show the deprecation warning', () => {
      fixtureSync(`
        <component-element>
          <template></template>
        </component-element>
      `);

      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.args[0][0]).to.equal(
        `WARNING: <template> inside <component-element> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`,
      );
    });
  });
});
