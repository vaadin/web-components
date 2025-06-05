/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ComboBoxItemMixin } from '@vaadin/combo-box/src/vaadin-combo-box-item-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { itemStyles } from '@vaadin/item/src/styles/vaadin-item-core-styles.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An item element used by the `<vaadin-time-picker>` dropdown.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|--------------
 * `checkmark` | The graphical checkmark shown for a selected item
 * `content`   | The element that wraps the item content
 *
 * The following state attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `selected`   | Set when the item is selected
 * `focused`    | Set when the item is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @mixes ComboBoxItemMixin
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @private
 */
export class TimePickerItem extends ComboBoxItemMixin(
  CSSInjectionMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-time-picker-item';
  }

  static get styles() {
    return itemStyles;
  }

  /** @protected */
  render() {
    return html`
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }

  /**
   * Override method from `ComboBoxItemMixin` to enforce
   * `dir` attribute to be set to `ltr` on the item.
   * @protected
   * @override
   */
  _getHostDir() {
    // See https://github.com/vaadin/vaadin-time-picker/issues/145
    return 'ltr';
  }
}

defineCustomElement(TimePickerItem);
