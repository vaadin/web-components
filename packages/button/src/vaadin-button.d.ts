/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ActiveMixin } from '@vaadin/field-base/src/active-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

declare class Button extends ControlStateMixin(ActiveMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  /**
   * A getter that returns the native button as a focusable element for ControlStateMixin.
   */
  readonly focusElement: HTMLButtonElement | null;
}

export { Button };
