import { DelegateFocusMixin } from '../../src/delegate-focus-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

class Base {
  foo = 'foo';
}

class SubClass extends DelegateFocusMixin(Base) {
  protected _setFocused(focused: boolean) {
    super._setFocused(focused);
  }
}

const instance = new SubClass();
assertType<string>(instance.foo);
assertType<boolean>(instance.disabled);
assertType<Element | null | undefined>(instance.focusElement);
