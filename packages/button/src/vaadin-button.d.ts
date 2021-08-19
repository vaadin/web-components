import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ActiveMixin } from '@vaadin/field-base/src/active-mixin.js';
import { DisabledMixin } from '@vaadin/field-base/src/disabled-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';

declare class Button extends ActiveMixin(DelegateFocusMixin(DisabledMixin(ElementMixin(ThemableMixin(HTMLElement))))) {
  /**
   * A getter that returns the native button as a focusable element for DelegateFocusMixin.
   */
  readonly focusElement: Element | null;
}

export { Button };
