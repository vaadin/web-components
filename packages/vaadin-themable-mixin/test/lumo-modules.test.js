import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { parseStyleSheets } from '../src/lumo-modules.js';

const BASE_PATH = import.meta.url.split('/').slice(0, -1).join('/');

describe('Lumo modules', () => {
  it('should extract modules defined via @media rules', () => {
    fixtureSync(`
      <style>
        @media lumo_base-field {
          #label {
            color: gray;
          }
        }
      </style>
      <style>
        @media lumo_text-field {
          #input {
            color: yellow;
          }
        }

        @media lumo_email-field {
          #input {
            color: green;
          }
        }
      </style>
    `);

    const { modules } = parseStyleSheets([...document.styleSheets]);
    expect(modules).to.have.lengthOf(3);
    expect(modules.get('lumo_base-field').map((rule) => rule.cssText)).to.eql(['#label { color: gray; }']);
    expect(modules.get('lumo_text-field').map((rule) => rule.cssText)).to.eql(['#input { color: yellow; }']);
    expect(modules.get('lumo_email-field').map((rule) => rule.cssText)).to.eql(['#input { color: green; }']);
  });

  it('should extract modules defined via @import rules', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/lumo-modules-test-global.css';
        @import '${BASE_PATH}/lumo-modules-test-global.css' lumo_global;
      </style>
    `);
    await oneEvent(style, 'load');

    const { modules } = parseStyleSheets([...document.styleSheets]);
    expect(modules).to.have.lengthOf(1);
    expect(modules.get('lumo_global').map((rule) => rule.cssText)).to.eql(['h1 { font-size: 2em; }']);
  });

  it('should extract tag-to-modules mappings', () => {
    fixtureSync(`
      <style>
        html {
          --vaadin-text-field-lumo-inject-modules: lumo_base-field, lumo_text-field;
        }
      </style>
      <style>
        html {
          --vaadin-email-field-lumo-inject-modules: lumo_base-field, lumo_email-field;
        }
      </style>
    `);

    const { tags } = parseStyleSheets([...document.styleSheets]);
    expect(tags).to.have.lengthOf(2);
    expect(tags.get('vaadin-text-field')).to.eql(['lumo_base-field', 'lumo_text-field']);
    expect(tags.get('vaadin-email-field')).to.eql(['lumo_base-field', 'lumo_email-field']);
  });

  it('should extract modules defined inside imported stylesheets', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/lumo-modules-test-email-field.css';
        @import '${BASE_PATH}/lumo-modules-test-text-field.css';
      </style>
    `);
    await oneEvent(style, 'load');

    const { modules } = parseStyleSheets([...document.styleSheets]);
    expect(modules).to.have.lengthOf(3);
    expect(modules.get('lumo_base-field').map((rule) => rule.cssText)).to.eql(['#label { color: gray; }']);
    expect(modules.get('lumo_text-field').map((rule) => rule.cssText)).to.eql(['#input { color: yellow; }']);
    expect(modules.get('lumo_email-field').map((rule) => rule.cssText)).to.eql(['#input { color: green; }']);
  });

  it('should extract tag-to-modules mappings defined inside imported stylesheets', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/lumo-modules-test-email-field.css';
        @import '${BASE_PATH}/lumo-modules-test-text-field.css';
      </style>
    `);
    await oneEvent(style, 'load');

    const { tags } = parseStyleSheets([...document.styleSheets]);
    expect(tags).to.have.lengthOf(2);
    expect(tags.get('vaadin-text-field')).to.eql(['lumo_base-field', 'lumo_text-field']);
    expect(tags.get('vaadin-email-field')).to.eql(['lumo_base-field', 'lumo_email-field']);
  });

  describe('adoptedStyleSheets', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      document.adoptedStyleSheets = [];
      console.warn.restore();
    });

    it('should extract modules from adoptedStyleSheets', () => {
      const style0 = new CSSStyleSheet();
      style0.replaceSync(`
        @media lumo_base-field {
          #label {
            color: gray;
          }
        }
      `);
      const style1 = new CSSStyleSheet();
      style1.replaceSync(`
        @media lumo_text-field {
          #input {
            color: yellow;
          }
        }

        @media lumo_email-field {
          #input {
            color: green;
          }
        }
      `);
      document.adoptedStyleSheets = [style0, style1];

      const { modules } = parseStyleSheets([...document.adoptedStyleSheets]);
      expect(modules).to.have.lengthOf(3);
      expect(modules.get('lumo_base-field').map((rule) => rule.cssText)).to.eql(['#label { color: gray; }']);
      expect(modules.get('lumo_text-field').map((rule) => rule.cssText)).to.eql(['#input { color: yellow; }']);
      expect(modules.get('lumo_email-field').map((rule) => rule.cssText)).to.eql(['#input { color: green; }']);
    });

    it('should extract tag-to-modules mappings from adoptedStyleSheets', () => {
      const style0 = new CSSStyleSheet();
      style0.replaceSync(`
        html {
          --vaadin-text-field-lumo-inject-modules: lumo_base-field, lumo_text-field;
        }
      `);
      const style1 = new CSSStyleSheet();
      style1.replaceSync(`
        html {
          --vaadin-email-field-lumo-inject-modules: lumo_base-field, lumo_email-field;
        }
      `);
      document.adoptedStyleSheets = [style0, style1];

      const { tags } = parseStyleSheets([...document.adoptedStyleSheets]);
      expect(tags).to.have.lengthOf(2);
      expect(tags.get('vaadin-text-field')).to.eql(['lumo_base-field', 'lumo_text-field']);
      expect(tags.get('vaadin-email-field')).to.eql(['lumo_base-field', 'lumo_email-field']);
    });

    it('should not throw when stylesheet rules are not accessible', () => {
      const style = new CSSStyleSheet();

      sinon.stub(style, 'cssRules').get(() => {
        throw new DOMException('Failed to read the "cssRules" property from "CSSStyleSheet"', 'SecurityError');
      });

      document.adoptedStyleSheets = [style];

      expect(() => parseStyleSheets([...document.adoptedStyleSheets])).to.not.throw();
      expect(console.warn).to.be.calledWithMatch(
        '[LumoInjector] Browser denied to access property "cssRules" for some CSS stylesheets, so they were skipped.',
      );
    });

    it('should not throw when rule media text is not accessible', () => {
      const style = new CSSStyleSheet();
      style.replaceSync('@media lumo_text-field {}');

      sinon.stub(style.cssRules[0].media, 'mediaText').get(() => {
        throw new DOMException('Permission denied to access property "mediaText"');
      });

      document.adoptedStyleSheets = [style];

      expect(() => parseStyleSheets([...document.adoptedStyleSheets])).to.not.throw();
      expect(console.warn).to.be.calledWithMatch(
        '[LumoInjector] Browser denied to access property "mediaText" for some CSS rules, so they were skipped.',
      );
    });
  });

  describe('shadowRoot', () => {
    let root;

    beforeEach(() => {
      root = fixtureSync('<div></div>');
      root.attachShadow({ mode: 'open' });
    });

    it('should extract modules from shadowRoot', () => {
      const adoptedStyleSheet = new CSSStyleSheet();
      adoptedStyleSheet.replaceSync(`
        @media lumo_text-field {
          :host {
            color: yellow;
          }
        }
      `);
      root.shadowRoot.adoptedStyleSheets = [adoptedStyleSheet];

      root.shadowRoot.innerHTML = `
        <style>
          @media lumo_email-field {
            :host {
              color: green;
            }
          }
        </style>
      `;

      const { modules } = parseStyleSheets([...root.shadowRoot.styleSheets, ...root.shadowRoot.adoptedStyleSheets]);
      expect(modules).to.have.lengthOf(2);
      expect(modules.get('lumo_text-field').map((rule) => rule.cssText)).to.eql([':host { color: yellow; }']);
      expect(modules.get('lumo_email-field').map((rule) => rule.cssText)).to.eql([':host { color: green; }']);
    });

    it('should extract tag-to-modules mappings from shadowRoot', () => {
      const adoptedStyleSheet = new CSSStyleSheet();
      adoptedStyleSheet.replaceSync(`
        :host  {
          --vaadin-text-field-lumo-inject-modules: lumo_text-field;
        }
      `);
      root.shadowRoot.adoptedStyleSheets = [adoptedStyleSheet];

      root.shadowRoot.innerHTML = `
        <style>
          :host {
            --vaadin-email-field-lumo-inject-modules: lumo_email-field;
          }
        </style>
      `;

      const { tags } = parseStyleSheets([...root.shadowRoot.styleSheets, ...root.shadowRoot.adoptedStyleSheets]);
      expect(tags).to.have.lengthOf(2);
      expect(tags.get('vaadin-text-field')).to.eql(['lumo_text-field']);
      expect(tags.get('vaadin-email-field')).to.eql(['lumo_email-field']);
    });
  });
});
