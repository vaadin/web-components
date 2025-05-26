import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { extractTagScopedCSSRules } from '../src/css-rules.js';

const BASE_PATH = import.meta.url.split('/').slice(0, -1).join('/');

describe('CSS rules extraction', () => {
  it('should extract and deduplicate rules from tag-scoped @media', () => {
    fixtureSync(`
      <style>
        @media test-button {
          :host {
            color: black;
          }
        }

        @media test-button {
          :host {
            color: red;
          }
        }

        @media test-button {
          :host {
            color: black;
          }
        }

        @media test-text-field {
          #label {
            color: black;
          }

          #error-message {
            color: black;
          }
        }
      </style>
      <style>
        @media test-text-field {
          #error-message {
            color: red;
          }
        }
      </style>
    `);

    {
      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal(':host { color: red; }');
      expect(rules[1].cssText).to.equal(':host { color: black; }');
    }
    {
      const rules = extractTagScopedCSSRules(document, 'test-text-field');
      expect(rules).to.have.lengthOf(3);
      expect(rules[0].cssText).to.equal('#label { color: black; }');
      expect(rules[1].cssText).to.equal('#error-message { color: black; }');
      expect(rules[2].cssText).to.equal('#error-message { color: red; }');
    }
  });

  it('should extract and deduplicate rules from tag-scoped @import', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/css-rules-extraction-test-button-black.css' test-button;
        @import '${BASE_PATH}/css-rules-extraction-test-button-red.css' test-button;
        @import '${BASE_PATH}/css-rules-extraction-test-button-black.css' test-button;
        @import '${BASE_PATH}/css-rules-extraction-test-text-field.css' test-text-field;
      </style>
    `);
    await oneEvent(style, 'load');

    {
      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal(':host { color: red; }');
      expect(rules[1].cssText).to.equal(':host { color: black; }');
    }
    {
      const rules = extractTagScopedCSSRules(document, 'test-text-field');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal('#label { color: black; }');
      expect(rules[1].cssText).to.equal('#error-message { color: black; }');
    }
  });

  it('should extract and deduplicate rules from tag-scoped @media and @import inside an imported stylesheet', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/css-rules-extraction-test-shared.css';
      </style>
    `);
    await oneEvent(style, 'load');

    {
      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal(':host { color: red; }');
      expect(rules[1].cssText).to.equal(':host { color: black; }');
    }
    {
      const rules = extractTagScopedCSSRules(document, 'test-text-field');
      expect(rules).to.have.lengthOf(3);
      expect(rules[0].cssText).to.equal('#label { color: black; }');
      expect(rules[1].cssText).to.equal('#error-message { color: black; }');
      expect(rules[2].cssText).to.equal('#error-message { color: red; }');
    }
  });

  describe('adoptedStyleSheets', () => {
    afterEach(() => {
      document.adoptedStyleSheets = [];
    });

    it('should extract rules from tag-scoped @media', () => {
      const style0 = new CSSStyleSheet();
      style0.replaceSync(`
        @media test-button {
          :host {
            color: black;
          }
        }
      `);
      const style1 = new CSSStyleSheet();
      style1.replaceSync(`
        @media test-button {
          :host {
            color: red;
          }
        }
      `);
      document.adoptedStyleSheets = [style0, style1];

      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal(':host { color: black; }');
      expect(rules[1].cssText).to.equal(':host { color: red; }');
    });

    it('should put adoptedStyleSheet rules after other rules', () => {
      const style = new CSSStyleSheet();
      style.replaceSync(`
        @media test-button {
          :host {
            color: black;
          }
        }
      `);
      document.adoptedStyleSheets = [style];

      fixtureSync(`
        <style>
          @media test-button {
            :host {
              color: red;
            }
          }
        </style>
      `);

      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal(':host { color: red; }');
      expect(rules[1].cssText).to.equal(':host { color: black; }');
    });
  });

  describe('shadowRoot', () => {
    let root;

    beforeEach(() => {
      root = fixtureSync('<div></div>');
      root.attachShadow({ mode: 'open' });
    });

    it('should extract rules from tag-scoped @media inside shadowRoot', () => {
      const adoptedStyleSheet = new CSSStyleSheet();
      adoptedStyleSheet.replaceSync(`
        @media test-button {
          :host {
            color: black;
          }
        }
      `);
      root.shadowRoot.adoptedStyleSheets = [adoptedStyleSheet];

      root.shadowRoot.innerHTML = `
        <style>
          @media test-button {
            :host {
              color: red;
            }
          }
        </style>
      `;

      const rules = extractTagScopedCSSRules(root.shadowRoot, 'test-button');
      expect(rules).to.have.lengthOf(2);
      expect(rules[0].cssText).to.equal(':host { color: red; }');
      expect(rules[1].cssText).to.equal(':host { color: black; }');
    });
  });
});
