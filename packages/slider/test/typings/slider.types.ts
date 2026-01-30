import '../../vaadin-slider.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SliderMixinClass } from '../../src/vaadin-slider-mixin.js';
import type { Slider, SliderChangeEvent, SliderValueChangedEvent } from '../../vaadin-slider.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const slider = document.createElement('vaadin-slider');

assertType<Slider>(slider);

slider.addEventListener('value-changed', (event) => {
  assertType<SliderValueChangedEvent>(event);
  assertType<number>(event.detail.value);
});

slider.addEventListener('change', (event) => {
  assertType<SliderChangeEvent>(event);
  assertType<Slider>(event.target);
});

// Properties
assertType<number>(slider.max);
assertType<number>(slider.min);
assertType<number>(slider.step);
assertType<number>(slider.value);
assertType<boolean>(slider.disabled);
assertType<boolean>(slider.readonly);

// Mixins
assertType<DisabledMixinClass>(slider);
assertType<ElementMixinClass>(slider);
assertType<FieldMixinClass>(slider);
assertType<FocusMixinClass>(slider);
assertType<LabelMixinClass>(slider);
assertType<ThemableMixinClass>(slider);
assertType<SliderMixinClass>(slider);
assertType<ValidateMixinClass>(slider);
