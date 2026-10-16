/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-step>` is a single step inside a `<vaadin-stepper>`.
 *
 * ```html
 * <vaadin-step completed path="/checkout/cart">
 *   Shopping cart
 *   <span slot="description">3 items</span>
 * </vaadin-step>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name     | Description
 * --------------|------------
 * `link`        | The interactive `<a>` rendered when `path` is set.
 * `nolink`      | The non-interactive element rendered when `path` is unset.
 * `indicator`   | The circle showing the step number, or the completed / invalid icon.
 * `content`     | Wraps the label and the description.
 * `label`       | Wraps the step's text content.
 * `description` | Wraps the content of the `description` slot.
 * `connector`   | The line connecting the step to the next one. Not rendered for the last step.
 *
 * The following state attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|------------
 * `current`     | Set when the step is the current step.
 * `completed`   | Set when the step is completed.
 * `invalid`     | Set when the step needs attention.
 * `disabled`    | Set when the step is disabled.
 * `focus-ring`  | Set when the step is focused by the keyboard.
 * `focused`     | Set when the step is focused.
 * `orientation` | Set by the parent `<vaadin-stepper>` to its orientation.
 *
 * See `<vaadin-stepper>` for the custom CSS properties that are available for styling.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Step extends FocusMixin(DisabledMixin(ElementMixin(HTMLElement))) {
  /**
   * The path to navigate to. When set, the step renders as a link
   * (`<a part="link">`); when unset, it renders as a non-interactive
   * element (`<div part="nolink">`).
   */
  path: string | null | undefined;

  /**
   * When true, the step is the current step of the process.
   * It is announced to assistive technology with `aria-current="step"`.
   */
  current: boolean;

  /**
   * When true, the step is completed. The indicator shows a check mark
   * instead of the step number.
   */
  completed: boolean;

  /**
   * When true, the step needs attention, e.g. because it contains invalid
   * data. The indicator shows an error icon instead of the step number.
   * Takes visual precedence over `completed`.
   */
  invalid: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-step': Step;
  }
}

export { Step };
