/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ButtonMixin } from './vaadin-button-mixin.js';

/**
 * `<vaadin-button>` is an accessible and customizable button that allows users to perform actions.
 *
 * ```html
 * <vaadin-button>Press me</vaadin-button>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the button.
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * The following attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the button is pressed down, either with mouse, touch or the keyboard.
 * `disabled`   | Set when the button is disabled.
 * `focus-ring` | Set when the button is focused using the keyboard.
 * `focused`    | Set when the button is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Button extends ButtonMixin(ElementMixin(ThemableMixin(ControllerMixin(HTMLElement)))) {
  /**
   * When set to true, prevents any user interaction with the button such as
   * clicking, hovering, etc. It also removes the button from the tab order.
   *
   * Please note that this behavior may negatively impact accessibility, as disabled
   * buttons become completely hidden from screen readers. To improve accessibility,
   * disabled buttons can be made focusable so that screen readers can reach and
   * properly announce them, including any attached tooltips and popovers, while
   * still preventing clicks. This is currently available as an experimental
   * enhancement that can be enabled with the following feature flag:
   *
   * ```
   * // Set before any button is attached to the DOM.
   * window.Vaadin.featureFlags.accessibleDisabledButtons = true;
   * ```
   */
  disabled: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-button': Button;
  }
}

export { Button };
