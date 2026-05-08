import { I18nMixin } from '../../../src/i18n-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const DEFAULT_I18N = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    qux: 'qux',
  },
};

class TestElement extends I18nMixin<typeof HTMLElement, typeof DEFAULT_I18N>(HTMLElement) {
  static get defaultI18n() {
    return DEFAULT_I18N;
  }
}

const element = new TestElement();

assertType<typeof DEFAULT_I18N>(element.i18n);
