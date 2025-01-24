import { I18nMixin } from '../../../src/i18n-mixin';

const assertType = <TExpected>(actual: TExpected) => actual;

const DEFAULT_I18N = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    qux: 'qux',
  },
};

class TestElement extends I18nMixin(HTMLElement, DEFAULT_I18N) {}

const element = new TestElement();

// Verify i18n property accepts deep partials
assertType<{ foo?: string }>(element.i18n);
assertType<{ bar?: object }>(element.i18n);
assertType<{ bar?: { baz?: string } }>(element.i18n);
