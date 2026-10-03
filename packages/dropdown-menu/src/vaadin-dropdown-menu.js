/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/context-menu/src/vaadin-context-menu-item.js';
import '@vaadin/context-menu/src/vaadin-context-menu-list-box.js';
import './vaadin-dropdown-menu-button.js';
import './vaadin-dropdown-menu-overlay.js';
import './vaadin-dropdown-menu-submenu.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { dropdownMenuStyles } from './styles/vaadin-dropdown-menu-base-styles.js';
import { DropdownMenuMixin } from './vaadin-dropdown-menu-mixin.js';

/**
 * `<vaadin-dropdown-menu>` is a Web Component that shows a button
 * which opens a dropdown menu of actions.
 *
 * Define the menu with the `items` property:
 *
 * ```html
 * <vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>
 * ```
 * ```js
 * const menu = document.querySelector('vaadin-dropdown-menu');
 * menu.items = [
 *   { text: 'Edit' },
 *   { text: 'Share', children: [{ text: 'By email' }, { text: 'By link' }] },
 *   { component: 'hr' },
 *   { text: 'Delete', disabled: true },
 * ];
 * menu.addEventListener('item-selected', (e) => console.log(e.detail.value.text));
 * ```
 *
 * Or with a slotted list-box:
 *
 * ```html
 * <vaadin-dropdown-menu label="Actions">
 *   <vaadin-context-menu-list-box slot="overlay">
 *     <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
 *     <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
 *   </vaadin-context-menu-list-box>
 * </vaadin-dropdown-menu>
 * ```
 *
 * When an item is selected, the `item-selected` event is fired. Its `detail.value`
 * is the item object with `items`, and the item element with a slotted list-box.
 *
 * ### Custom button
 *
 * To customize the button content, e.g. to add an icon, provide a
 * `<vaadin-dropdown-menu-button>` in the `button` slot. In this case,
 * the `label` property is ignored:
 *
 * ```html
 * <vaadin-dropdown-menu>
 *   <vaadin-dropdown-menu-button slot="button">
 *     <vaadin-icon icon="vaadin:cog" slot="prefix"></vaadin-icon>
 *     Settings
 *   </vaadin-dropdown-menu-button>
 * </vaadin-dropdown-menu>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|---------------------------
 * `backdrop` | Backdrop of the overlay
 * `overlay`  | The overlay container
 * `content`  | The overlay content
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|-------------------------------------------
 * `opened`         | Set when the menu is open
 * `disabled`       | Set when the component is disabled
 * `focus-ring`     | Set when the button is focused using the keyboard
 * `opening`        | Set when the overlay is opening
 * `closing`        | Set when the overlay is closing
 * `top-aligned`    | Set when the overlay is aligned to the top of the button
 * `bottom-aligned` | Set when the overlay is aligned to the bottom of the button
 * `start-aligned`  | Set when the overlay is aligned to the start of the button
 * `end-aligned`    | Set when the overlay is aligned to the end of the button
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                     | Description
 * ----------------------------------------|-------------
 * `--vaadin-dropdown-menu-overlay-width`  | Minimum width of the menu overlay. Defaults to the button width
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @slot button - Slot for a custom `<vaadin-dropdown-menu-button>`, used instead of the default one
 *
 * @fires {CustomEvent} item-selected - Fired when an item is selected.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the menu is closed.
 *
 * @attr {string} theme - The theme variants to apply to the button.
 * @customElement vaadin-dropdown-menu
 * @extends HTMLElement
 * @mixes DropdownMenuMixin
 * @mixes ContextMenuMixin
 * @mixes ElementMixin
 */
class DropdownMenu extends DropdownMenuMixin(
  ContextMenuMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-dropdown-menu';
  }

  static get experimental() {
    return true;
  }

  static get styles() {
    return dropdownMenuStyles;
  }

  /** @protected */
  render() {
    const { position } = this;

    return html`
      <vaadin-dropdown-menu-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .model="${this._context}"
        .modeless="${this._modeless}"
        .renderer="${this.__slottedListBox ? undefined : this.items ? this.__itemsRenderer : undefined}"
        .position="${position}"
        .positionTarget="${this.listenOn}"
        .horizontalAlign="${position.endsWith('-end') ? 'end' : 'start'}"
        .verticalAlign="${position.startsWith('top') ? 'bottom' : 'top'}"
        no-vertical-overlap
        .withBackdrop="${this._phone}"
        ?phone="${this._phone}"
        exportparts="backdrop, overlay, content"
        @opened-changed="${this._onOverlayOpened}"
        @vaadin-overlay-open="${this._onVaadinOverlayOpen}"
        @vaadin-overlay-closed="${this._onVaadinOverlayClosed}"
      >
        <slot name="overlay" @slotchange="${this.__onOverlaySlotChange}"></slot>
        <slot name="submenu" slot="submenu"></slot>
      </vaadin-dropdown-menu-overlay>

      <slot name="button"></slot>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(DropdownMenu);

export { DropdownMenu };
