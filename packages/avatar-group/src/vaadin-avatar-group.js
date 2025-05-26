/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/avatar/src/vaadin-avatar.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-avatar-group-menu.js';
import './vaadin-avatar-group-menu-item.js';
import './vaadin-avatar-group-overlay.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { avatarGroupStyles } from './vaadin-avatar-group-core-styles.js';
import { AvatarGroupMixin } from './vaadin-avatar-group-mixin.js';

/**
 * `<vaadin-avatar-group>` is a Web Component providing avatar group displaying functionality.
 *
 * To create the avatar group, first add the component to the page:
 *
 * ```
 * <vaadin-avatar-group></vaadin-avatar-group>
 * ```
 *
 * And then use [`items`](#/elements/vaadin-avatar-group#property-items) property to initialize the structure:
 *
 * ```
 * document.querySelector('vaadin-avatar-group').items = [
 *   {name: 'John Doe'},
 *   {abbr: 'AB'}
 * ];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name   | Description
 * ----------- | ---------------
 * `container` | The container element
 *
 * See the [`<vaadin-avatar>`](#/elements/vaadin-avatar) documentation for the available
 * state attributes and stylable shadow parts of avatar elements.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-avatar-group>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-avatar-group-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-avatar-group-menu>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-avatar-group-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes AvatarGroupMixin
 * @mixes ThemableMixin
 */
class AvatarGroup extends AvatarGroupMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-avatar-group';
  }

  static get styles() {
    return avatarGroupStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="container" part="container">
        <slot></slot>
        <slot name="overflow"></slot>
      </div>
      <vaadin-avatar-group-overlay
        id="overlay"
        .opened="${this._opened}"
        .positionTarget="${this._overflow}"
        no-vertical-overlap
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
        @vaadin-overlay-open="${this._onVaadinOverlayOpen}"
        @opened-changed="${this._onOpenedChanged}"
      ></vaadin-avatar-group-overlay>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this._opened = event.detail.value;
  }
}

defineCustomElement(AvatarGroup);

export { AvatarGroup };
