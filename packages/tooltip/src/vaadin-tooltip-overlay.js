/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/vaadin-overlay/src/vaadin-overlay-position-mixin.js';

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-tooltip>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class TooltipOverlay extends PositionMixin(OverlayElement) {
  static get is() {
    return 'vaadin-tooltip-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      memoizedTemplate.content.querySelector('[part~="overlay"]').removeAttribute('tabindex');
    }

    return memoizedTemplate;
  }

  static get properties() {
    return {
      position: {
        type: String,
        reflectToAttribute: true,
      },
    };
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
      this.style.top = `${parseFloat(this.style.top) + offset}px`;
    }
  }
}

customElements.define(TooltipOverlay.is, TooltipOverlay);
