import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

// A helper function that creates a <dom-module> style module and registers it
function registerStyleModule(themeFor, style, { moduleId, include = undefined }) {
  const domModule = document.createElement('dom-module');
  domModule.setAttribute('theme-for', themeFor);
  domModule.id = moduleId;
  domModule.innerHTML = `
    <template>
      <style ${include ? `include = ${include}` : ''}>${style.cssText}</style>
    </template>
  `;
  domModule.register(moduleId);
}

describe('lazy import', () => {
  // Need to run the logic in a single test because the adapter can only be imported lazily once
  it('should convert styleRegistry to dom-modules', async () => {
    const customElementName = 'custom-element';

    // Create styles before importing the adapter:

    // A simple theme using registerStyles
    registerStyles(
      customElementName,
      css`
        :host {
          --register-styles-style: 'true';
        }
      `
    );

    // A <dom-module> theme without theme-for
    registerStyleModule(
      undefined,
      css`
        :host {
          --included-dom-module-style: 'true';
        }
      `,
      { moduleId: 'dom-module-style' }
    );

    // A theme using registerStyles with an include of a dom-module defined above
    registerStyles(customElementName, undefined, { include: 'dom-module-style' });

    // A theme using registerStyles without theme-for
    registerStyles(
      undefined,
      css`
        :host {
          --included-register-styles-style: 'true';
        }
      `,
      { moduleId: 'registered-style' }
    );

    // A <dom-module> theme with an include of a registerStyle theme defined above
    registerStyleModule(customElementName, css``, {
      moduleId: 'dom-module-style-include-only',
      include: 'registered-style'
    });

    // Import the adapter lazily
    await import('../style-modules.js');

    expect(window.Vaadin.styleModules.getAllThemes()).not.to.be.empty;

    // Define the custom element
    const customElement = fixtureSync('<custom-element>');
    defineCustomElement(customElementName);

    const styles = getComputedStyle(customElement);
    expect(styles.getPropertyValue('--register-styles-style')).to.be.ok;
    expect(styles.getPropertyValue('--included-dom-module-style')).to.be.ok;
    expect(styles.getPropertyValue('--included-register-styles-style')).to.be.ok;
  });
});
