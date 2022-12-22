/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tooltip-overlay',
  css`
    [part='overlay'] {
      max-width: 40ch;
    }

    :host([position^='top'][top-aligned]) [part='overlay'],
    :host([position^='bottom'][top-aligned]) [part='overlay'] {
      margin-top: var(--vaadin-tooltip-offset-top, 0);
    }

    :host([position^='top'][bottom-aligned]) [part='overlay'],
    :host([position^='bottom'][bottom-aligned]) [part='overlay'] {
      margin-bottom: var(--vaadin-tooltip-offset-bottom, 0);
    }

    :host([position^='start'][start-aligned]) [part='overlay'],
    :host([position^='end'][start-aligned]) [part='overlay'] {
      margin-inline-start: var(--vaadin-tooltip-offset-start, 0);
    }

    :host([position^='start'][end-aligned]) [part='overlay'],
    :host([position^='end'][end-aligned]) [part='overlay'] {
      margin-inline-end: var(--vaadin-tooltip-offset-end, 0);
    }
  `,
  { moduleId: 'vaadin-tooltip-overlay-styles' },
);

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-tooltip>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @private
 */
class TooltipOverlay extends PositionMixin(Overlay) {
  static get is() {
    return 'vaadin-tooltip-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      memoizedTemplate.content.querySelector('[part~="overlay"]').removeAttribute('tabindex');

      // Remove whitespace text nodes around the content slot to allow "white-space: pre"
      memoizedTemplate.content.querySelector('[part~="content"]').innerHTML = '<slot></slot>';
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

customElements.define(TooltipOverlay.is, TooltipOverlay);
