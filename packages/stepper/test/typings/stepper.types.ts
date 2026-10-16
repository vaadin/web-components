import '../../vaadin-stepper.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { Step } from '../../vaadin-step.js';
import type { Stepper, StepperI18n, StepperOrientation } from '../../vaadin-stepper.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const stepper = document.createElement('vaadin-stepper');
assertType<Stepper>(stepper);
assertType<ElementMixinClass>(stepper);
assertType<I18nMixinClass<StepperI18n>>(stepper);
assertType<StepperOrientation>(stepper.orientation);
assertType<StepperI18n>(stepper.i18n);

const step = document.createElement('vaadin-step');
assertType<Step>(step);
assertType<DisabledMixinClass>(step);
assertType<FocusMixinClass>(step);
assertType<string | null | undefined>(step.path);
assertType<boolean>(step.current);
assertType<boolean>(step.completed);
assertType<boolean>(step.invalid);
