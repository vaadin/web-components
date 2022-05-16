import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

let createStyles =
  window.createStylesFunction ||
  ((moduleId, themeFor, styles) => {
    registerStyles(themeFor, styles, { moduleId });
  });

let defineCustomElement = (name, parentName, content = '') => {
  class CustomElement extends ThemableMixin(parentName ? customElements.get(parentName) : PolymerElement) {
    static get is() {
      return name;
    }

    static get template() {
      const template = document.createElement('template');
      template.innerHTML = content;
      return template;
    }
  }

  customElements.define(name, CustomElement);
};

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

class TestFoo extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'test-foo';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div part="text" id="text">text</div>
    `;
  }
}

customElements.define(TestFoo.is, TestFoo);

class TestBar extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'test-bar';
  }

  static get template() {
    return html`<div part="text" id="text">text</div>`;
  }
}

customElements.define(TestBar.is, TestBar);

class TestBaz extends TestBar {
  static get is() {
    return 'test-baz';
  }
}

customElements.define(TestBaz.is, TestBaz);

class TestQux extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'test-qux';
  }

  static get template() {
    return html`<div part="text" id="text">text</div>`;
  }
}

customElements.define(TestQux.is, TestQux);

class TestOwnTemplate extends TestFoo {
  static get is() {
    return 'test-own-template';
  }

  static get template() {
    return html`<div part="text" id="text">text</div>`;
  }
}

customElements.define(TestOwnTemplate.is, TestOwnTemplate);

class TestNoTemplate extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'test-no-template';
  }

  static get template() {
    // I don't want your template! Or anyone's template! Leave me alone!
    return null;
  }
}

customElements.define(TestNoTemplate.is, TestNoTemplate);

class TestStyleOverride extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'test-style-override';
  }

  static get template() {
    return html`<div part="text" id="text">text</div>`;
  }
}

customElements.define(TestStyleOverride.is, TestStyleOverride);

describe('ThemableMixin', () => {
  let wrapper, components;

  beforeEach(() => {
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
  });

  it('should inject simple module', () => {
    expect(getComputedStyle(components[0].$.text).color).to.equal('rgb(255, 255, 255)');
  });

  it('should inject multiple style modules', () => {
    expect(getComputedStyle(components[0].$.text).color).to.equal('rgb(255, 255, 255)');
    expect(getComputedStyle(components[0].$.text).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to multiple components', () => {
    expect(getComputedStyle(components[0].$.text).backgroundColor).to.equal('rgb(255, 0, 0)');
    expect(getComputedStyle(components[1].$.text).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to subclassed components', () => {
    expect(getComputedStyle(components[2].$.text).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should inject to wildcard styles', () => {
    expect(getComputedStyle(components[0].$.text).position).to.equal('static');
    expect(getComputedStyle(components[1].$.text).position).to.equal('relative');
    expect(getComputedStyle(components[2].$.text).position).to.equal('relative');
  });

  it('should override default value', () => {
    expect(getComputedStyle(components[0]).display).to.equal('flex');
  });

  it('should fall back to default styles', () => {
    expect(getComputedStyle(components[3].$.text).color).to.equal('rgb(255, 0, 0)');
  });

  it('should work with themable parent', () => {
    expect(getComputedStyle(components[2].$.text).width).to.equal('100px');
  });

  it('should inherit parent themes to own custom template', () => {
    expect(getComputedStyle(components[4].$.text).backgroundColor).to.equal('rgb(255, 0, 0)');
  });

  it('should override vaadin module styles', () => {
    expect(getComputedStyle(components[6].$.text).color).to.equal('rgb(0, 0, 0)');
  });

  it('lumo should override vaadin module styles', () => {
    expect(getComputedStyle(components[6].$.text).display).to.equal('inline');
  });

  it('material should override vaadin module styles', () => {
    expect(getComputedStyle(components[6].$.text).opacity).to.equal('0.5');
  });

  it('should override lumo module styles', () => {
    expect(getComputedStyle(components[6].$.text).color).to.equal('rgb(0, 0, 0)');
  });

  it('should override material module styles', () => {
    expect(getComputedStyle(components[6].$.text).color).to.equal('rgb(0, 0, 0)');
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
    defineCustomElement(name, name + '-parent');

    // Create an instance of the test-duplicate component
    const testComponent = fixtureSync(`<${name}></${name}>`);
    // Get all the styles from the component as one big string (let's assume it may have multiple style tags)
    const styles = [...testComponent.shadowRoot.querySelectorAll('style')].map((style) => style.textContent).join('');
    // Check the number of occurences of the style rule
    const occurrences = styles.split(duplicateStyle.toString()).length - 1;
    // There should be only one occurence
    expect(occurrences).to.equal(1);
  });
});
