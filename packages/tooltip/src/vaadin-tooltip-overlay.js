/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TooltipOverlayMixin } from './vaadin-tooltip-overlay-mixin.js';
import { tooltipOverlayStyles } from './vaadin-tooltip-overlay-styles.js';

registerStyles('vaadin-tooltip-overlay', [overlayStyles, tooltipOverlayStyles], {
  moduleId: 'vaadin-tooltip-overlay-styles',
});

/**
 * An element used internally by `<vaadin-tooltip>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @mixes TooltipOverlayMixin
 * @private
 */
class TooltipOverlay extends TooltipOverlayMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-tooltip-overlay';
  }

  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    // When setting `manual` and `opened` attributes, the overlay is already moved to body
    // by the time when `ready()` callback of the `vaadin-tooltip` is executed by Polymer,
    // so querySelector() would return null. So we use this workaround to set properties.
    this.owner = this.__dataHost;
    this.owner._overlayElement = this;
  }
}

defineCustomElement(TooltipOverlay);
