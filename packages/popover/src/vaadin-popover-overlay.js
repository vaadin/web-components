/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { popoverOverlayStyles } from './styles/vaadin-popover-overlay-core-styles.js';
import { PopoverOverlayMixin } from './vaadin-popover-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-popover>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes PopoverOverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class PopoverOverlay extends PopoverOverlayMixin(
  DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-popover-overlay';
  }

  static get styles() {
    return popoverOverlayStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="arrow"></div>
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  /**
   * @override
   * @protected
   */
  get _contentRoot() {
    return this.owner;
  }

  /**
   * @override
   * @protected
   */
  get _modalRoot() {
    return this.owner;
  }

  /**
   * @protected
   * @override
   */
  _attachOverlay() {
    this.showPopover();
  }

  /**
   * @protected
   * @override
   */
  _detachOverlay() {
    this.hidePopover();
  }
}

defineCustomElement(PopoverOverlay);
