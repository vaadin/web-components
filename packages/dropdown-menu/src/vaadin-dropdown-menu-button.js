/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { dropdownMenuButtonStyles } from './styles/vaadin-dropdown-menu-button-base-styles.js';

/**
 * `<vaadin-dropdown-menu-button>` is the button that opens the menu of `<vaadin-dropdown-menu>`.
 * Place it in the `button` slot of `<vaadin-dropdown-menu>` to customize the button content:
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
 * Part name   | Description
 * ------------|------------------------------------------
 * `label`     | The label (text) inside the button
 * `prefix`    | A slot for content before the label (e.g. an icon)
 * `suffix`    | A slot for content after the label (e.g. an icon)
 * `indicator` | The dropdown indicator after the suffix
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the button is pressed down, or while the menu is open
 * `disabled`   | Set when the button is disabled
 * `expanded`   | Set while the menu is open
 * `focus-ring` | Set when the button is focused using the keyboard
 * `focused`    | Set when the button is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @slot - Default slot for the button label
 * @slot prefix - Slot for content before the label (e.g. an icon)
 * @slot suffix - Slot for content after the label (e.g. an icon)
 *
 * @customElement vaadin-dropdown-menu-button
 * @extends HTMLElement
 */
class DropdownMenuButton extends ButtonMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dropdown-menu-button';
  }

  static get styles() {
    return [buttonStyles, dropdownMenuButtonStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-button-container" role="presentation">
        <span part="prefix" aria-hidden="true">
          <slot name="prefix"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="suffix" aria-hidden="true">
          <slot name="suffix"></slot>
        </span>
        <span part="indicator" aria-hidden="true"></span>
      </div>
    `;
  }

  /**
   * Override method inherited from `ActiveMixin` to keep the `active`
   * attribute while the menu is expanded.
   *
   * @param {boolean} active
   * @protected
   * @override
   */
  _setActive(active) {
    if (!active && this.hasAttribute('expanded')) {
      return;
    }
    super._setActive(active);
  }

  /**
   * Override method from `TabindexMixin` to allow focusing the disabled button
   * when the `accessibleDisabledButtons` feature flag is enabled.
   * @protected
   * @override
   */
  __shouldAllowFocusWhenDisabled() {
    return window.Vaadin.featureFlags.accessibleDisabledButtons;
  }
}

defineCustomElement(DropdownMenuButton);

export { DropdownMenuButton };
