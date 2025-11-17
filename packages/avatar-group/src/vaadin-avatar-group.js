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
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { avatarGroupStyles } from './styles/vaadin-avatar-group-base-styles.js';
import { AvatarGroupMixin } from './vaadin-avatar-group-mixin.js';

/**
 * `<vaadin-avatar-group>` is a Web Component providing avatar group displaying functionality.
 *
 * To create the avatar group, first add the component to the page:
 *
 * ```html
 * <vaadin-avatar-group></vaadin-avatar-group>
 * ```
 *
 * And then use [`items`](#/elements/vaadin-avatar-group#property-items) property to initialize the structure:
 *
 * ```js
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
 * `overlay`   | The overflow avatar menu overlay
 * `content`   | The overflow avatar menu overlay content
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
 * - `<vaadin-avatar-group-menu>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-avatar-group-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes AvatarGroupMixin
 * @mixes ThemableMixin
 */
class AvatarGroup extends AvatarGroupMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-avatar-group';
  }

  static get styles() {
    return avatarGroupStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
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
        .owner="${this}"
        .opened="${this._opened}"
        .positionTarget="${this._overflow}"
        no-vertical-overlap
        exportparts="overlay, content"
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
        @vaadin-overlay-open="${this._onVaadinOverlayOpen}"
        @opened-changed="${this._onOpenedChanged}"
      >
        <slot name="overlay"></slot>
      </vaadin-avatar-group-overlay>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this._opened = event.detail.value;
  }
}

defineCustomElement(AvatarGroup);

export { AvatarGroup };
