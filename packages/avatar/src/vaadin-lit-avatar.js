/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-avatar-icons.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AvatarMixin } from './vaadin-avatar-mixin.js';
import { avatarStyles } from './vaadin-avatar-styles.js';

/**
 * LitElement based version of `<vaadin-avatar>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Avatar extends AvatarMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-avatar';
  }

  static get styles() {
    return avatarStyles;
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
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
      <svg
        part="icon"
        ?hidden="${!this.__iconVisible}"
        id="avatar-icon"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text dy=".35em" text-anchor="middle">&#xea01;</text>
      </svg>
      <svg
        part="abbr"
        ?hidden="${!this.__abbrVisible}"
        id="avatar-abbr"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text dy=".35em" text-anchor="middle">${this.abbr}</text>
      </svg>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(Avatar);

export { Avatar };
