/**
 * @license
 * Copyright (c) 2020 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/avatar/src/vaadin-avatar.js';
import './vaadin-avatar-group-menu.js';
import './vaadin-avatar-group-menu-item.js';
import './vaadin-avatar-group-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AvatarGroupMixin } from './vaadin-avatar-group-mixin.js';
import { avatarGroupStyles } from './vaadin-avatar-group-styles.js';

registerStyles('vaadin-avatar-group', avatarGroupStyles, { moduleId: 'vaadin-avatar-group-styles' });

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
 * @mixes ControllerMixin
 * @mixes ElementMixin
 * @mixes AvatarGroupMixin
 * @mixes ThemableMixin
 */
class AvatarGroup extends AvatarGroupMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))) {
  static get template() {
    return html`
      <div id="container" part="container">
        <slot></slot>
        <slot name="overflow"></slot>
      </div>
      <vaadin-avatar-group-overlay
        id="overlay"
        opened="{{_opened}}"
        position-target="[[_overflow]]"
        no-vertical-overlap
        on-vaadin-overlay-close="_onVaadinOverlayClose"
        on-vaadin-overlay-open="_onVaadinOverlayOpen"
      ></vaadin-avatar-group-overlay>
    `;
  }

  static get is() {
    return 'vaadin-avatar-group';
  }
}

defineCustomElement(AvatarGroup);

export { AvatarGroup };
