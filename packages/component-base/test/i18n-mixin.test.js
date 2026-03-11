import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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

class I18nMixinLitElement extends I18nMixin(DEFAULT_I18N, PolylitMixin(LitElement)) {
  static get is() {
    return 'i18n-mixin-lit-element';
  }
}

customElements.define(I18nMixinLitElement.is, I18nMixinLitElement);

describe('I18nMixin', () => {
  let element;

  beforeEach(async () => {
    element = document.createElement(I18nMixinLitElement.is);
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

  it('should not refresh i18n when setting property to same reference', () => {
    const customI18n = { foo: 'Custom Foo' };
    element.i18n = customI18n;

    const effectiveI18n = element.__effectiveI18n;

    element.i18n = customI18n;

    expect(element.__effectiveI18n).to.equal(effectiveI18n);
  });

  it('should initialize property from i18n attribute JSON string', () => {
    const i18nJson = JSON.stringify({ foo: 'Custom Foo' });
    element = fixtureSync(`<i18n-mixin-lit-element i18n='${i18nJson}'></i18n-mixin-lit-element>`);

    expect(element.i18n).to.have.property('foo', 'Custom Foo');
    expect(element.__effectiveI18n).to.deep.equal({ ...DEFAULT_I18N, foo: 'Custom Foo' });
  });

  it('should update property when i18n attribute is changed', () => {
    element.setAttribute('i18n', JSON.stringify({ foo: 'Updated Foo' }));

    expect(element.i18n).to.have.property('foo', 'Updated Foo');
    expect(element.__effectiveI18n).to.deep.equal({ ...DEFAULT_I18N, foo: 'Updated Foo' });
  });

  it('should initialize __effectiveI18n when i18n own property is set before upgrade', async () => {
    // Simulate a scenario where a parent element sets i18n on a child
    // before the child is upgraded (e.g. during custom element upgrade
    // when parent's updated() propagates i18n to not-yet-upgraded children).
    const tagName = 'i18n-mixin-late-define';

    // Create element in DOM before it's defined — it's a plain HTMLElement
    const el = fixtureSync(`<${tagName}></${tagName}>`);

    // Set i18n as a plain own data property (no setter exists yet)
    el.i18n = { foo: 'Pre-upgrade' };
    expect(Object.prototype.hasOwnProperty.call(el, 'i18n')).to.be.true;

    // Now define the element — triggers upgrade
    class LateElement extends I18nMixin(DEFAULT_I18N, PolylitMixin(LitElement)) {
      static get is() {
        return tagName;
      }
    }
    customElements.define(tagName, LateElement);
    await customElements.whenDefined(tagName);
    await nextRender();

    // After upgrade, __effectiveI18n should be initialized (not undefined).
    expect(el.__effectiveI18n).to.not.be.undefined;
    expect(el.__effectiveI18n).to.deep.equal({ ...DEFAULT_I18N, foo: 'Pre-upgrade' });
  });
});
