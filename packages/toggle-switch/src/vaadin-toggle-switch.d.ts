/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CheckboxMixin } from '@vaadin/checkbox/src/vaadin-checkbox-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-toggle-switch>` is a binary on/off switch input field.
 */
export declare class ToggleSwitch extends CheckboxMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-toggle-switch': ToggleSwitch;
  }
}
