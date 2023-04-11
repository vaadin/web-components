/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ComboBoxItem } from '@vaadin/combo-box/src/vaadin-combo-box-item.js';

/**
 * An element used for items in `<vaadin-time-picker>`.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `content` | The element that wraps the item content
 *
 * The following state attributes are exposed for styling:
 *
 * Attribute  | Description                   | Part name
 * -----------|-------------------------------|-----------
 * `selected` | Set when the item is selected | :host
 * `focused`  | Set when the item is focused  | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends ComboBoxItem
 * @private
 */
class TimePickerItem extends ComboBoxItem {
  static get is() {
    return 'vaadin-time-picker-item';
  }
}

customElements.define(TimePickerItem.is, TimePickerItem);
