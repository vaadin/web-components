import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { extractTagScopedCSSRules } from '../src/css-rules.js';

const BASE_PATH = import.meta.url.split('/').slice(0, -1).join('/');

describe('CSS rules extraction', () => {
  it('should extract rules from tag-scoped @media at-rules', () => {
    fixtureSync(`
      <style>
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

        @media test-text-field {
          #error-message {
            color: red;
          }
        }
      </style>
    `);

    {
      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.length(1);
      expect(rules[0].cssText).to.equal(':host { color: black; }');
    }
    {
      const rules = extractTagScopedCSSRules(document, 'test-text-field');
      expect(rules).to.have.length(3);
      expect(rules[0].cssText).to.equal('#label { color: black; }');
      expect(rules[1].cssText).to.equal('#error-message { color: black; }');
      expect(rules[2].cssText).to.equal('#error-message { color: red; }');
    }
  });

  it('should extract rules from tag-scoped @import at-rules ', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/css-rules-extraction-test-button.css' test-button;
        @import '${BASE_PATH}/css-rules-extraction-test-text-field.css' test-text-field;
      </style>
    `);
    await oneEvent(style, 'load');

    {
      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.length(1);
      expect(rules[0].cssText).to.equal(':host { color: black; }');
    }
    {
      const rules = extractTagScopedCSSRules(document, 'test-text-field');
      expect(rules).to.have.length(2);
      expect(rules[0].cssText).to.equal('#label { color: black; }');
      expect(rules[1].cssText).to.equal('#error-message { color: black; }');
    }
  });

  it('should extract rules from tag-scoped @media and @import at-rules inside an imported stylesheet', async () => {
    const style = fixtureSync(`
      <style>
        @import '${BASE_PATH}/css-rules-extraction-test-shared.css';
      </style>
    `);
    await oneEvent(style, 'load');

    {
      const rules = extractTagScopedCSSRules(document, 'test-button');
      expect(rules).to.have.length(1);
      expect(rules[0].cssText).to.equal(':host { color: black; }');
    }
    {
      const rules = extractTagScopedCSSRules(document, 'test-text-field');
      expect(rules).to.have.length(3);
      expect(rules[0].cssText).to.equal('#label { color: black; }');
      expect(rules[1].cssText).to.equal('#error-message { color: black; }');
      expect(rules[2].cssText).to.equal('#error-message { color: red; }');
    }
  });
});
