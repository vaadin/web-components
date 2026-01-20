import '../../vaadin-range-slider.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SliderMixinClass } from '../../src/vaadin-slider-mixin.js';
import type { RangeSlider, RangeSliderChangeEvent, RangeSliderValueChangedEvent } from '../../vaadin-range-slider.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const slider = document.createElement('vaadin-range-slider');

assertType<RangeSlider>(slider);

slider.addEventListener('value-changed', (event) => {
  assertType<RangeSliderValueChangedEvent>(event);
  assertType<number[]>(event.detail.value);
});

slider.addEventListener('change', (event) => {
  assertType<RangeSliderChangeEvent>(event);
  assertType<RangeSlider>(event.target);
});

// Properties
assertType<number>(slider.max);
assertType<number>(slider.min);
assertType<number>(slider.step);
assertType<number[]>(slider.value);
assertType<boolean>(slider.disabled);
assertType<boolean>(slider.readonly);

// Mixins
assertType<DisabledMixinClass>(slider);
assertType<ElementMixinClass>(slider);
assertType<FocusMixinClass>(slider);
assertType<ThemableMixinClass>(slider);
assertType<SliderMixinClass>(slider);
