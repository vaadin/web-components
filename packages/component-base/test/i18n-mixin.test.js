import { expect } from '@vaadin/chai-plugins';
import { nextRender } from '@vaadin/testing-helpers';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { LitElement } from 'lit';
import { I18nMixin } from '../src/i18n-mixin.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

const DEFAULT_I18N = {
  foo: 'Foo',
  bar: {
    baz: 'Baz',
  },
  qux: ['q', 'u', 'x'],
};

class I18nMixinPolymerElement extends I18nMixin(PolymerElement, DEFAULT_I18N) {
  static get is() {
    return 'i18n-mixin-polymer-element';
  }
}

customElements.define(I18nMixinPolymerElement.is, I18nMixinPolymerElement);

class I18nMixinLitElement extends I18nMixin(PolylitMixin(LitElement), DEFAULT_I18N) {
  static get is() {
    return 'i18n-mixin-lit-element';
  }
}

customElements.define(I18nMixinLitElement.is, I18nMixinLitElement);

const runTests = (baseClass) => {
  let element;

  beforeEach(async () => {
    element = document.createElement(baseClass.is);
    document.body.appendChild(element);
    await nextRender();
  });

  it('should initialize with deep copy of defaults', () => {
    expect(element.i18n).to.deep.equal(DEFAULT_I18N);
    expect(element.i18n).to.not.equal(DEFAULT_I18N);
    expect(element.i18n.bar).to.not.equal(DEFAULT_I18N.bar);
    expect(element.i18n.qux).to.not.equal(DEFAULT_I18N.qux);

    expect(element.__effectiveI18n).to.deep.equal(DEFAULT_I18N);
    expect(element.__effectiveI18n).to.not.equal(DEFAULT_I18N);
    expect(element.__effectiveI18n.bar).to.not.equal(DEFAULT_I18N.bar);
    expect(element.__effectiveI18n.qux).to.not.equal(DEFAULT_I18N.qux);
  });

  it('should return same reference that was set previously', () => {
    const customI18n = { foo: 'Custom Foo' };
    element.i18n = customI18n;
    expect(element.i18n).to.equal(customI18n);
  });

  it('should deep merge custom i18n with default i18n', () => {
    element.i18n = {};
    expect(element.__effectiveI18n).to.deep.equal(DEFAULT_I18N);

    element.i18n = { foo: 'Custom Foo' };
    expect(element.__effectiveI18n).to.deep.equal({ ...DEFAULT_I18N, foo: 'Custom Foo' });

    element.i18n = { bar: { baz: 'Custom Baz' } };
    expect(element.__effectiveI18n).to.deep.equal({ ...DEFAULT_I18N, bar: { baz: 'Custom Baz' } });
  });

  it('should ignore null and undefined values in custom i18n', () => {
    element.i18n = { foo: null };
    expect(element.__effectiveI18n).to.deep.equal(DEFAULT_I18N);

    element.i18n = { bar: undefined };
    expect(element.__effectiveI18n).to.deep.equal(DEFAULT_I18N);

    element.i18n = { bar: { baz: null } };
    expect(element.__effectiveI18n).to.deep.equal(DEFAULT_I18N);
  });
};

describe('I18nMixin + Polymer', () => {
  runTests(I18nMixinPolymerElement);
});

describe('I18nMixin + Lit', () => {
  runTests(I18nMixinLitElement);
});
