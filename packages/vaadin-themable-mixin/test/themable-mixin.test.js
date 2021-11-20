import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

let createStyles =
  window.createStylesFunction ||
  ((moduleId, themeFor, styles) => {
    registerStyles(themeFor, styles, { moduleId });
  });

let defineCustomElement =
  window.defineCustomElementFunction ||
  ((name, parentName, content = '', styles) => {
    class CustomElement extends ThemableMixin(parentName ? customElements.get(parentName) : PolymerElement) {
      static get is() {
        return name;
      }

      static get template() {
        if (content) {
          if (styles) {
            content = `<style>${styles}</style>${content}`;
          }

          const template = document.createElement('template');
          template.innerHTML = content;
          return template;
        } else {
          return super.template;
        }
      }
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
  `
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
  `
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
  `
);

createStyles(
  'test-styles-multiple',
  'test-foo test-bar',
  css`
    [part='text'] {
      background-color: rgb(255, 0, 0);
    }
  `
);

createStyles(
  'test-styles-wildcard',
  'test*a*',
  css`
    [part='text'] {
      position: relative;
    }
  `
);

createStyles(
  'baz-styles',
  'test-baz',
  css`
    [part='text'] {
      width: 100px;
    }
  `
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
  `
);

createStyles(
  'custom-test-style-override-styles-second',
  'test-style-override',
  css`
    :host {
      position: relative;
    }
  `
);

createStyles(
  'vaadin-test-style-override-styles-first',
  'test-style-override',
  css`
    :host {
      display: flex;
    }
  `
);

createStyles(
  'lumo-test-style-override-styles',
  'test-style-override',
  css`
    [part='text'] {
      color: rgb(255, 0, 0);
      display: inline;
    }
  `
);

createStyles(
  'material-test-style-override-styles',
  'test-style-override',
  css`
    [part='text'] {
      color: rgb(0, 255, 0);
      opacity: 0.5;
    }
  `
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
  `
);

defineCustomElement(
  'test-foo',
  '',
  '<div part="text" id="text">text</div>',
  `
  :host {
    display: block;
  }
`
);

defineCustomElement('test-bar', '', `<div part="text" id="text">text</div>`);

defineCustomElement('test-baz', 'test-bar', '');

defineCustomElement('test-qux', '', '<div part="text" id="text">text</div>');

defineCustomElement('test-own-template', 'test-foo', `<div part="text" id="text">text</div>`);

defineCustomElement('test-no-template', '', '');

defineCustomElement('test-style-override', '', '<div part="text" id="text">text</div>');

function getText(element) {
  return element.shadowRoot.querySelector('#text');
}

describe('ThemableMixin', () => {
  let wrapper, components;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <test-foo></test-foo>
        <test-bar></test-bar>
        <test-baz></test-baz>
        <test-qux></test-qux>
        <test-own-template></test-own-template>
        <test-no-template></test-no-template>
        <test-style-override></test-style-override>
      </div>
    `);
    components = wrapper.children;
    await nextFrame();
    await nextFrame();
  });

  it('should inject simple module', () => {
    expect(getComputedStyle(getText(components[0])).color).to.equal('rgb(255, 255, 255)');
  });

  it('should inject multiple style modules', () => {
    expect(getComputedStyle(getText(components[0])).color).to.equal('rgb(255, 255, 255)');
    expect(getComputedStyle(getText(components[0])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to multiple components', () => {
    expect(getComputedStyle(getText(components[0])).backgroundColor).to.equal('rgb(255, 0, 0)');
    expect(getComputedStyle(getText(components[1])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to subclassed components', () => {
    expect(getComputedStyle(getText(components[2])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to wildcard styles', () => {
    expect(getComputedStyle(getText(components[0])).position).to.equal('static');
    expect(getComputedStyle(getText(components[1])).position).to.equal('relative');
    expect(getComputedStyle(getText(components[2])).position).to.equal('relative');
  });

  it('should override default value', () => {
    expect(getComputedStyle(components[0]).display).to.equal('flex');
  });

  it('should fall back to default styles', () => {
    expect(getComputedStyle(getText(components[3])).color).to.equal('rgb(255, 0, 0)');
  });

  it('should work with themable parent', () => {
    expect(getComputedStyle(getText(components[2])).width).to.equal('100px');
  });

  it('should inherit parent themes to own custom template', () => {
    expect(getComputedStyle(getText(components[4])).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should override vaadin module styles', () => {
    expect(getComputedStyle(getText(components[6])).color).to.equal('rgb(0, 0, 0)');
  });

  it('lumo should override vaadin module styles', () => {
    expect(getComputedStyle(getText(components[6])).display).to.equal('inline');
  });

  it('material should override vaadin module styles', () => {
    expect(getComputedStyle(getText(components[6])).opacity).to.equal('0.5');
  });

  it('should override lumo module styles', () => {
    expect(getComputedStyle(getText(components[6])).color).to.equal('rgb(0, 0, 0)');
  });

  it('should override material module styles', () => {
    expect(getComputedStyle(getText(components[6])).color).to.equal('rgb(0, 0, 0)');
  });

  it('should respect vaadin style module order', () => {
    expect(getComputedStyle(components[6]).display).to.equal('block');
  });

  it('should respect custom style module order', () => {
    expect(getComputedStyle(components[6]).position).to.equal('relative');
  });

  it('should not include duplicate styles', () => {
    const name = 'test-duplicate';

    // Create a wildcard style that applies to both the parent and the child
    const duplicateStyle = css`
      :host {
        color: blue;
      }
    `;
    createStyles('vaadin-test-duplicate-styles', 'test-duplicate*', duplicateStyle);

    // Define the test-duplicate-parent and test-duplicate components
    defineCustomElement(name + '-parent');
    defineCustomElement(name, name + '-parent', '<div></div>');

    // Create an instance of the test-duplicate component
    const testComponent = fixtureSync(`<${name}></${name}>`);

    // Get all the style rules from the component
    // Gather from the <style> tags (PolymerElement) and from the adoptedStyleSheets (LitElement)
    const rules = [
      ...testComponent.shadowRoot.adoptedStyleSheets,
      ...[...testComponent.shadowRoot.querySelectorAll('style')].map((style) => style.sheet)
    ]
      .map((sheet) => [...sheet.cssRules])
      .flat();

    // Check the number of occurences of the style rule
    const occurrences = rules.reduce(
      (acc, rule) => acc + (rule.cssText === duplicateStyle.styleSheet.cssRules[0].cssText ? 1 : 0),
      0
    );

    // There should be only one occurence
    expect(occurrences).to.equal(1);
  });
});
