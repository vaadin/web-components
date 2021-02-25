import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '../vaadin-themable-mixin.js';

function createDomModule(id, themeFor, tpl) {
  const domModule = document.createElement('dom-module');
  domModule.setAttribute('theme-for', themeFor);
  domModule.appendChild(tpl);
  domModule.register(id);
}

createDomModule(
  'test-qux-default-theme',
  'test-qux',
  html`
    <style>
      [part='text'] {
        color: rgb(255, 0, 0);
      }
    </style>
  `
);

/* This default style module should get overridden by test-foo styles.
Removing this module doesn't make any difference to the test outcome but it's
here to make a point. */
createDomModule(
  'test-foo-default-theme',
  'test-foo',
  html`
    <style>
      [part='text'] {
        color: rgb(0, 0, 0) !important;
        background-color: rgb(255, 0, 0);
      }
    </style>
  `
);

createDomModule(
  'test-styles',
  'test-foo',
  html`
    <style>
      :host {
        display: flex;
      }

      [part='text'] {
        color: rgb(255, 255, 255);
      }
    </style>
  `
);

createDomModule(
  'test-styles-multiple',
  'test-foo test-bar',
  html`
    <style>
      [part='text'] {
        background-color: rgb(255, 0, 0);
      }
    </style>
  `
);

createDomModule(
  'test-styles-wildcard',
  'test*a*',
  html`
    <style>
      [part='text'] {
        position: relative;
      }
    </style>
  `
);

createDomModule(
  'baz-styles',
  'test-baz',
  html`
    <style>
      [part='text'] {
        width: 100px;
      }
    </style>
  `
);

createDomModule(
  'custom-test-style-override-styles-first',
  'test-style-override',
  html`
    <style>
      :host {
        position: absolute;
      }

      [part='text'] {
        color: rgb(0, 0, 0);
      }
    </style>
  `
);

createDomModule(
  'custom-test-style-override-styles-second',
  'test-style-override',
  html`
    <style>
      :host {
        position: relative;
      }
    </style>
  `
);

createDomModule(
  'vaadin-test-style-override-styles-first',
  'test-style-override',
  html`
    <style>
      :host {
        display: flex;
      }
    </style>
  `
);

createDomModule(
  'lumo-test-style-override-styles',
  'test-style-override',
  html`
    <style>
      [part='text'] {
        color: rgb(255, 0, 0);
        display: inline;
      }
    </style>
  `
);

createDomModule(
  'material-test-style-override-styles',
  'test-style-override',
  html`
    <style>
      [part='text'] {
        color: rgb(0, 255, 0);
        opacity: 0.5;
      }
    </style>
  `
);

createDomModule(
  'vaadin-test-style-override-styles-second',
  'test-style-override',
  html`
    <style>
      :host {
        display: block;
      }

      [part='text'] {
        color: rgb(255, 255, 255);
        opacity: 1;
        display: block;
      }
    </style>
  `
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

  it('should not inherit parent themes to own custom template', () => {
    expect(getComputedStyle(components[4].$.text).backgroundColor).not.to.equal('rgb(255, 0, 0)');
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
});
