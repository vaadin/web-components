import '../../vaadin-split-layout';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { SplitLayoutMixinClass } from '../../src/vaadin-split-layout-mixin.js';
import type { SplitLayoutI18n } from '../../vaadin-split-layout.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const layout = document.createElement('vaadin-split-layout');

// Properties
assertType<SplitLayoutI18n>(layout.i18n);
assertType<'horizontal' | 'vertical'>(layout.orientation);

// Mixins
assertType<FocusMixinClass>(layout);
assertType<SplitLayoutMixinClass>(layout);
assertType<I18nMixinClass<SplitLayoutI18n>>(layout);

layout.addEventListener('splitter-dragend', (event) => {
  assertType<Event>(event);
});
