/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { avatarStyles } from './styles/vaadin-avatar-base-styles.js';
import { AvatarMixin } from './vaadin-avatar-mixin.js';

/**
 * `<vaadin-avatar>` is a Web Component providing avatar displaying functionality.
 *
 * ```html
 * <vaadin-avatar img="avatars/avatar-1.jpg"></vaadin-avatar>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * --------- | ---------------
 * `abbr`    | The abbreviation element
 * `icon`    | The icon element
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property            | Description
 * -------------------------------|-------------
 * `--vaadin-avatar-background`   | Background color of the avatar
 * `--vaadin-avatar-border-color` | Border color of the avatar
 * `--vaadin-avatar-border-width` | Border width of the avatar
 * `--vaadin-avatar-font-size`    | Font size of the avatar
 * `--vaadin-avatar-font-weight`  | Font weight of the avatar
 * `--vaadin-avatar-size`         | Size of the avatar
 * `--vaadin-avatar-text-color`   | Text color of the avatar
 *
 * The following state attributes are available for styling:
 *
 * Attribute         | Description
 * ------------------|-------------
 * `focus-ring`      | Set when the avatar is focused using the keyboard.
 * `focused`         | Set when the avatar is focused.
 * `has-color-index` | Set when the avatar has `colorIndex` and the corresponding custom CSS property exists.
 * `has-tooltip`     | Set when the element has a slotted tooltip.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes AvatarMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Avatar extends AvatarMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-avatar';
  }

  static get styles() {
    return avatarStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <img
        ?hidden="${!this.__imgVisible}"
        src="${ifDefined(this.img)}"
        aria-hidden="true"
        @error="${this.__onImageLoadError}"
        draggable="false"
      />
      <div part="icon" ?hidden="${!this.__iconVisible}" aria-hidden="true"></div>
      <svg
        part="abbr"
        ?hidden="${!this.__abbrVisible}"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text dy=".35em" text-anchor="middle">${this.abbr}</text>
      </svg>

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

defineCustomElement(Avatar);

export { Avatar };
