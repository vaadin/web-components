import '../../vaadin-stepper.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { StepperMixinClass } from '../../src/vaadin-stepper-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const stepper = document.createElement('vaadin-stepper');

// Mixins
assertType<ElementMixinClass>(stepper);
assertType<ThemableMixinClass>(stepper);
assertType<StepperMixinClass>(stepper);
