/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { TooltipOverlayMixin } from '@vaadin/tooltip/src/vaadin-tooltip-overlay-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-popover>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @mixes TooltipOverlayMixin
 * @private
 */
class TooltipOverlay extends TooltipOverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-popover-overlay';
  }

  static get styles() {
    return [overlayStyles];
  }

  static get properties() {
    return {
      /**
       * When true, the overlay is visible and attached to body.
       * This property config is overridden to set `sync: true`.
       */
      opened: {
        type: Boolean,
        notify: true,
        observer: '_openedChanged',
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(TooltipOverlay);
