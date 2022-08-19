import '../../vaadin-tooltip.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const tooltip = document.createElement('vaadin-tooltip');

// Mixins
assertType<ElementMixinClass>(tooltip);
