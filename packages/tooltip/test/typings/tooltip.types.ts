import '../../vaadin-tooltip.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { TooltipPosition } from '../../vaadin-tooltip.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const tooltip = document.createElement('vaadin-tooltip');

// Mixins
assertType<ElementMixinClass>(tooltip);
assertType<ThemePropertyMixinClass>(tooltip);

// Properties
assertType<string | undefined>(tooltip.for);
assertType<HTMLElement | undefined>(tooltip.target);
assertType<string | null | undefined>(tooltip.text);
assertType<Record<string, unknown>>(tooltip.context);
assertType<(context: Record<string, unknown>) => string>(tooltip.generator);
assertType<boolean>(tooltip.manual);
assertType<boolean>(tooltip.opened);
assertType<number>(tooltip.focusDelay);
assertType<number>(tooltip.hideDelay);
assertType<number>(tooltip.hoverDelay);
assertType<TooltipPosition>(tooltip.position);
assertType<(target: HTMLElement) => boolean>(tooltip.shouldShow);
