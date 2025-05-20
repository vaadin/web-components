/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { PopoverOverlayMixin } from '@vaadin/popover/src/vaadin-popover-overlay-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { tooltipOverlayStyles } from './vaadin-tooltip-overlay-styles.js';

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
class TooltipOverlay extends PopoverOverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-tooltip-overlay';
  }

  static get styles() {
    return [overlayStyles, tooltipOverlayStyles];
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
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  requestContentUpdate() {
    super.requestContentUpdate();

    this.toggleAttribute('hidden', this.textContent.trim() === '');
  }
}

defineCustomElement(TooltipOverlay);
