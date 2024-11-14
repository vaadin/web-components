/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 */
declare class Card extends ElementMixin(ThemableMixin(ControllerMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-card': Card;
  }
}

export { Card };
