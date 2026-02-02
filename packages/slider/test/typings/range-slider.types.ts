import '../../vaadin-range-slider.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SliderMixinClass } from '../../src/vaadin-slider-mixin.js';
import type {
  RangeSlider,
  RangeSliderChangeEvent,
  RangeSliderInputEvent,
  RangeSliderInvalidChangedEvent,
  RangeSliderValidatedEvent,
  RangeSliderValueChangedEvent,
} from '../../vaadin-range-slider.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const slider = document.createElement('vaadin-range-slider');

assertType<RangeSlider>(slider);

slider.addEventListener('value-changed', (event) => {
  assertType<RangeSliderValueChangedEvent>(event);
  assertType<number[]>(event.detail.value);
});

slider.addEventListener('invalid-changed', (event) => {
  assertType<RangeSliderInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

slider.addEventListener('validated', (event) => {
  assertType<RangeSliderValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});

slider.addEventListener('change', (event) => {
  assertType<RangeSliderChangeEvent>(event);
  assertType<RangeSlider>(event.target);
});

slider.addEventListener('input', (event) => {
  assertType<RangeSliderInputEvent>(event);
  assertType<RangeSlider>(event.target);
});

// Properties
assertType<number>(slider.max);
assertType<number>(slider.min);
assertType<number>(slider.step);
assertType<number[]>(slider.value);
assertType<boolean>(slider.disabled);
assertType<boolean>(slider.readonly);
assertType<boolean>(slider.valueAlwaysVisible);

// Mixins
assertType<DisabledMixinClass>(slider);
assertType<ElementMixinClass>(slider);
assertType<FocusMixinClass>(slider);
assertType<FieldMixinClass>(slider);
assertType<LabelMixinClass>(slider);
assertType<ThemableMixinClass>(slider);
assertType<SliderMixinClass>(slider);
assertType<ValidateMixinClass>(slider);
