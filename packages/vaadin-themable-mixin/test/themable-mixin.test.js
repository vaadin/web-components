import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles, ThemableMixin, unsafeCSS } from '../vaadin-themable-mixin.js';

const createStyles =
  window.createStylesFunction ||
  ((moduleId, themeFor, styles) => {
    registerStyles(themeFor, styles, { moduleId });
  });

const defineCustomElement =
  window.defineCustomElementFunction ||
  // eslint-disable-next-line max-params
  ((name, parentName, content, styles, noIs) => {
    const parentElement = parentName ? customElements.get(parentName) : PolymerElement;
    class CustomElement extends ThemableMixin(parentElement) {}

    if (content) {
      Object.defineProperty(CustomElement, 'template', {
        get() {
          if (styles) {
            const cssText = Array.isArray(styles) ? styles.join('\n') : styles;
            content = `<style>${cssText}</style>${content}`;
          }

          const template = document.createElement('template');
          template.innerHTML = content;
          return template;
        },
      });
    }

    if (!noIs) {
      Object.defineProperty(CustomElement, 'is', {
        get() {
          return name;
        },
      });
    }

    customElements.define(name, CustomElement);
  });

createStyles(
  'test-qux-default-theme',
  'test-qux',
  css`
    [part='text'] {
      color: rgb(255, 0, 0);
    }
  `,
);

/* This default style module should get overridden by test-foo styles.
Removing this module doesn't make any difference to the test outcome but it's
here to make a point. */
createStyles(
  'test-foo-default-theme',
  'test-foo',
  css`
    [part='text'] {
      color: rgb(0, 0, 0) !important;
      background-color: rgb(255, 0, 0);
    }
  `,
);

createStyles(
  'test-styles',
  'test-foo',
  css`
    :host {
      display: flex;
    }

    [part='text'] {
      color: rgb(255, 255, 255);
    }
  `,
);

createStyles(
  'test-styles-multiple',
  'test-foo test-bar',
  css`
    [part='text'] {
      background-color: rgb(255, 0, 0);
    }
  `,
);

createStyles(
  'test-styles-wildcard',
  'test*a*',
  css`
    [part='text'] {
      position: relative;
    }
  `,
);

createStyles(
  'baz-styles',
  'test-baz',
  css`
    [part='text'] {
      width: 100px;
    }
  `,
);

createStyles(
  'custom-test-style-override-styles-first',
  'test-style-override',
  css`
    :host {
      position: absolute;
    }

    [part='text'] {
      color: rgb(0, 0, 0);
    }
  `,
);

createStyles(
  'custom-test-style-override-styles-second',
  'test-style-override',
  css`
    :host {
      position: relative;
    }
  `,
);

createStyles(
  'vaadin-test-style-override-styles-first',
  'test-style-override',
  css`
    :host {
      display: flex;
    }
  `,
);

createStyles(
  'lumo-test-style-override-styles',
  'test-style-override',
  css`
    [part='text'] {
      color: rgb(255, 0, 0);
      display: inline;
    }
  `,
);

createStyles(
  'material-test-style-override-styles',
  'test-style-override',
  css`
    [part='text'] {
      color: rgb(0, 255, 0);
      opacity: 0.5;
    }
  `,
);

createStyles(
  'vaadin-test-style-override-styles-second',
  'test-style-override',
  css`
    :host {
      display: block;
    }

    [part='text'] {
      color: rgb(255, 255, 255);
      opacity: 1;
      display: block;
    }
  `,
);

defineCustomElement(
  'test-foo',
  '',
  '<div part="text" id="text">text</div>',
  `
    :host {
      display: block;
    }
  `,
);

defineCustomElement('themable-mixin-component-type-test', '', '');

defineCustomElement('test-bar', '', '<div part="text" id="text">text</div>');

defineCustomElement('test-baz', 'test-bar', '');

defineCustomElement('test-qux', '', '<div part="text" id="text">text</div>');

defineCustomElement('test-own-template', 'test-foo', '<div part="text" id="text">text</div>');

defineCustomElement('test-own-template-no-is', 'test-foo', '<div part="text" id="text">text</div>', undefined, true);

defineCustomElement('test-no-template', '', '');

defineCustomElement('test-inherited-no-content-no-is', 'test-foo', '', undefined, true);

defineCustomElement('test-style-override', '', '<div part="text" id="text">text</div>');

defineCustomElement(
  'test-own-styles',
  '',
  '<div part="text" id="text">text</div>',
  `
    [part='text'] {
      color: rgb(255, 0, 0);
    }
  `,
);

defineCustomElement('test-own-styles-multiple', '', '<div part="text" id="text">text</div>', [
  `
    [part='text'] {
      color: rgb(255, 0, 0);
    }
  `,
  `
    [part='text'] {
      font-weight: 700;
    }
  `,
]);

function getText(element) {
  return element.shadowRoot.querySelector('#text');
}

describe('ThemableMixin', () => {
  let components;

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <test-foo></test-foo>
        <test-bar></test-bar>
        <test-baz></test-baz>
        <test-qux></test-qux>
        <test-own-template></test-own-template>
        <test-own-template-no-is></test-own-template-no-is>
        <test-no-template></test-no-template>
        <test-inherited-no-content-no-is></test-inherited-no-content-no-is>
        <test-style-override></test-style-override>
        <test-own-styles></test-own-styles>
        <test-own-styles-multiple></test-own-styles-multiple>
      </div>
    `);

    components = {};
    [...wrapper.children].forEach((child) => {
      components[child.localName] = child;
    });

    await nextFrame();
  });

  it('should inject simple module', () => {
    expect(getComputedStyle(getText(components['test-foo'])).color).to.equal('rgb(255, 255, 255)');
  });

  it('should inject multiple style modules', () => {
    expect(getComputedStyle(getText(components['test-foo'])).color).to.equal('rgb(255, 255, 255)');
    expect(getComputedStyle(getText(components['test-foo'])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to multiple components', () => {
    expect(getComputedStyle(getText(components['test-foo'])).backgroundColor).to.equal('rgb(255, 0, 0)');
    expect(getComputedStyle(getText(components['test-bar'])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to subclassed components', () => {
    expect(getComputedStyle(getText(components['test-baz'])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to wildcard styles', () => {
    expect(getComputedStyle(getText(components['test-foo'])).position).to.equal('static');
    expect(getComputedStyle(getText(components['test-bar'])).position).to.equal('relative');
    expect(getComputedStyle(getText(components['test-baz'])).position).to.equal('relative');
  });

  it('should override default value', () => {
    expect(getComputedStyle(components['test-foo']).display).to.equal('flex');
  });

  it('should fall back to default styles', () => {
    expect(getComputedStyle(getText(components['test-qux'])).color).to.equal('rgb(255, 0, 0)');
  });

  it('should work with themable parent', () => {
    expect(getComputedStyle(getText(components['test-baz'])).width).to.equal('100px');
  });

  it('should inherit parent themes to own custom template', () => {
    expect(getComputedStyle(getText(components['test-own-template'])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inherit parent themes to own custom template with no is defined', () => {
    expect(getComputedStyle(getText(components['test-own-template-no-is'])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inherit parent themes with no is nor content defined', () => {
    expect(getComputedStyle(getText(components['test-inherited-no-content-no-is'])).backgroundColor).to.equal(
      'rgb(255, 0, 0)',
    );
  });

  it('should override vaadin module styles', () => {
    expect(getComputedStyle(getText(components['test-style-override'])).color).to.equal('rgb(0, 0, 0)');
  });

  it('lumo should override vaadin module styles', () => {
    expect(getComputedStyle(getText(components['test-style-override'])).display).to.equal('inline');
  });

  it('material should override vaadin module styles', () => {
    expect(getComputedStyle(getText(components['test-style-override'])).opacity).to.equal('0.5');
  });

  it('should override lumo module styles', () => {
    expect(getComputedStyle(getText(components['test-style-override'])).color).to.equal('rgb(0, 0, 0)');
  });

  it('should override material module styles', () => {
    expect(getComputedStyle(getText(components['test-style-override'])).color).to.equal('rgb(0, 0, 0)');
  });

  it('should respect vaadin style module order', () => {
    expect(getComputedStyle(components['test-style-override']).display).to.equal('block');
  });

  it('should respect custom style module order', () => {
    expect(getComputedStyle(components['test-style-override']).position).to.equal('relative');
  });

  it('should not include duplicate styles', () => {
    const name = 'test-duplicate';

    // Create a wildcard style that applies to both the parent and the child
    const duplicateStyle = ':host { color: blue; }';
    createStyles('vaadin-test-duplicate-styles', 'test-duplicate*', unsafeCSS(duplicateStyle));

    // Define the test-duplicate-parent and test-duplicate components
    defineCustomElement(`${name}-parent`);
    defineCustomElement(name, `${name}-parent`, '<div></div>');

    // Create an instance of the test-duplicate component
    const testComponent = fixtureSync(`<${name}></${name}>`);

    // Get all the style rules from the component
    // Gather from the <style> tags (PolymerElement) and from the adoptedStyleSheets (LitElement)
    const rules = [
      ...(testComponent.shadowRoot.adoptedStyleSheets || []),
      ...[...testComponent.shadowRoot.querySelectorAll('style')].map((style) => style.sheet),
    ]
      .map((sheet) => [...sheet.cssRules])
      .flat();

    // Check the number of occurences of the style rule
    const occurrences = rules.filter((rule) => rule.cssText === duplicateStyle).length;

    // There should be only one occurence
    expect(occurrences).to.equal(1);
  });

  it('should have own styles', () => {
    expect(getComputedStyle(getText(components['test-own-styles'])).color).to.equal('rgb(255, 0, 0)');
  });

  it('should apply multiple own styles', () => {
    const text = getText(components['test-own-styles-multiple']);
    expect(getComputedStyle(text).color).to.equal('rgb(255, 0, 0)');
    expect(getComputedStyle(text).fontWeight).to.equal('700');
  });
});
