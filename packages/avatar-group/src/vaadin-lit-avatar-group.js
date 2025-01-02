/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/avatar/src/vaadin-lit-avatar.js';
import './vaadin-lit-avatar-group-menu.js';
import './vaadin-lit-avatar-group-menu-item.js';
import './vaadin-lit-avatar-group-overlay.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AvatarGroupMixin } from './vaadin-avatar-group-mixin.js';
import { avatarGroupStyles } from './vaadin-avatar-group-styles.js';

/**
 * LitElement based version of `<vaadin-avatar-group>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
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
