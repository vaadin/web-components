import '../../vaadin-date-range-picker.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const picker = document.createElement('vaadin-date-range-picker');

// Mixins
assertType<ElementMixinClass>(picker);
