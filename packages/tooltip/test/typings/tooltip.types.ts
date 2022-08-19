import '../../vaadin-tooltip.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const tooltip = document.createElement('vaadin-tooltip');

// Mixins
assertType<ElementMixinClass>(tooltip);
assertType<ThemePropertyMixinClass>(tooltip);

// Properties
assertType<string | undefined>(tooltip.for);
assertType<HTMLElement | undefined>(tooltip.target);
