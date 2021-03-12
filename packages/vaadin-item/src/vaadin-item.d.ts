import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { DirMixin } from '@vaadin/vaadin-element-mixin/vaadin-dir-mixin.js';

import { ItemMixin } from './vaadin-item-mixin.js';

/**
 * `<vaadin-item>` is a Web Component providing layout for items in tabs and menus.
 *
 * ```
 *   <vaadin-item>
 *     Item content
 *   </vaadin-item>
 * ```
 *
 * ### Selectable
 *
 * `<vaadin-item>` has the `selected` property and the corresponding state attribute.
 * Currently, the component sets the `selected` to false, when `disabled` property is set to true.
 * But other than that, the `<vaadin-item>` does not switch selection by itself.
 * In general, it is the wrapper component, like `<vaadin-list-box>`, which should update
 * the `selected` property on the items, e. g. on mousedown or when Enter / Spacebar is pressed.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ---|---
 * `content` | The element that wraps the slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `disabled` | Set to a disabled item | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `selected` | Set when the item is selected | :host
 * `active` | Set when mousedown or enter/spacebar pressed | :host
 */
declare class ItemElement extends ItemMixin(ThemableMixin(DirMixin(HTMLElement))) {
  /**
   * Submittable string value. The default value is the trimmed text content of the element.
   */
  value: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-item': ItemElement;
  }
}

export { ItemElement };
