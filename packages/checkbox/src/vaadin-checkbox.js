/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CheckboxMixin } from './vaadin-checkbox-mixin.js';
import { checkboxStyles } from './vaadin-checkbox-styles.js';

registerStyles('vaadin-checkbox', checkboxStyles, { moduleId: 'vaadin-checkbox-styles' });

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox label="I accept the terms and conditions"></vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|-------------
 * `checkbox`  | The element representing a stylable custom checkbox.
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description
 * ----------------|-------------
 * `active`        | Set when the checkbox is activated with mouse, touch or the keyboard.
 * `checked`       | Set when the checkbox is checked.
 * `disabled`      | Set when the checkbox is disabled.
 * `focus-ring`    | Set when the checkbox is focused using the keyboard.
 * `focused`       | Set when the checkbox is focused.
 * `indeterminate` | Set when the checkbox is in the indeterminate state.
 * `has-label`     | Set when the checkbox has a label.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 *
 * @extends HTMLElement
 * @mixes CheckboxMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
export class Checkbox extends CheckboxMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-checkbox';
  }

  static get template() {
    return html`
      <div class="vaadin-checkbox-container">
        <div part="checkbox" aria-hidden="true"></div>
        <slot name="input"></slot>
        <slot name="label"></slot>
      </div>
      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }
}

customElements.define(Checkbox.is, Checkbox);
