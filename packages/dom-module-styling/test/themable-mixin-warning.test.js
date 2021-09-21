import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';

function defineCustomElement(name) {
  customElements.define(
    name,
    class extends ThemableMixin(PolymerElement) {
      static get is() {
        return name;
      }

      static get template() {
        return html`foo`;
      }
    }
  );
}

describe('warnings', () => {
  beforeEach(() => {
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  it('should warn if styles registered without the adapter in place', async () => {
    const customElementName = 'custom-element';

    // Register styles before importing the adapter
    registerStyles(customElementName, css``);

    // Import the adapter
    await import('../dom-module-styling.js');

    // Define the custom element
    fixtureSync('<custom-element>');
    defineCustomElement(customElementName);

    expect(console.warn.called).to.be.true;
  });
});
