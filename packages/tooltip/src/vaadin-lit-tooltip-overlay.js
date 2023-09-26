/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { tooltipOverlayStyles } from './vaadin-tooltip-overlay-styles.js';

/**
 * An element used internally by `<vaadin-tooltip>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @mixes ThemableMixin
 * @private
 */
class TooltipOverlay extends PositionMixin(OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-tooltip-overlay';
  }

  static get styles() {
    return [overlayStyles, tooltipOverlayStyles];
  }

  static get properties() {
    return {
      position: {
        type: String,
        reflectToAttribute: true,
      },
    };
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

    // Copy custom properties from the tooltip
    if (this.positionTarget && this.owner) {
      const style = getComputedStyle(this.owner);
      ['top', 'bottom', 'start', 'end'].forEach((prop) => {
        this.style.setProperty(
          `--vaadin-tooltip-offset-${prop}`,
          style.getPropertyValue(`--vaadin-tooltip-offset-${prop}`),
        );
      });
    }
  }

  /**
   * @protected
   * @override
   */
  _updatePosition() {
    super._updatePosition();

    if (!this.positionTarget) {
      return;
    }

    // Center the tooltip overlay horizontally
    if (this.position === 'bottom' || this.position === 'top') {
      const targetRect = this.positionTarget.getBoundingClientRect();
      const overlayRect = this.$.overlay.getBoundingClientRect();

      const offset = targetRect.width / 2 - overlayRect.width / 2;

      if (this.style.left) {
        const left = overlayRect.left + offset;
        if (left > 0) {
          this.style.left = `${left}px`;
        }
      }

      if (this.style.right) {
        const right = parseFloat(this.style.right) + offset;
        if (right > 0) {
          this.style.right = `${right}px`;
        }
      }
    }

    // Center the tooltip overlay vertically
    if (this.position === 'start' || this.position === 'end') {
      const targetRect = this.positionTarget.getBoundingClientRect();
      const overlayRect = this.$.overlay.getBoundingClientRect();

      const offset = targetRect.height / 2 - overlayRect.height / 2;
      this.style.top = `${overlayRect.top + offset}px`;
    }
  }
}

defineCustomElement(TooltipOverlay);
