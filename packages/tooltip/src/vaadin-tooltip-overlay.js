/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { PopoverOverlayMixin } from '@vaadin/popover/src/vaadin-popover-overlay-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
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
 * @mixes PopoverOverlayMixin
 * @private
 */
class TooltipOverlay extends PopoverOverlayMixin(DirMixin(ThemableMixin(PolymerElement))) {
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

  /**
   * Tag name prefix used by custom properties.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-tooltip';
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

  requestContentUpdate() {
    super.requestContentUpdate();

    this.toggleAttribute('hidden', this.textContent.trim() === '');
  }
}

defineCustomElement(TooltipOverlay);
