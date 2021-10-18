import { FocusMixin } from '../../src/focus-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

class Base {
  foo = 'foo';
}

class SubClass extends FocusMixin(Base) {
  protected _setFocused(focused: boolean) {
    super._setFocused(focused);
  }
}

const instance = new SubClass();
assertType<string>(instance.foo);
