/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { MenuOverlayMixin } from '@vaadin/context-menu/src/vaadin-menu-overlay-mixin.js';
import { styles } from '@vaadin/context-menu/src/vaadin-menu-overlay-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes MenuOverlayMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @protected
 */
export class MenuBarOverlay extends MenuOverlayMixin(OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-menu-bar-overlay';
  }

  static get styles() {
    return [overlayStyles, styles];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

defineCustomElement(MenuBarOverlay);
