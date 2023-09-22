/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tooltipOverlayStyles = css`
  :host {
    z-index: 1100;
  }

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

  @media (forced-colors: active) {
    [part='overlay'] {
      outline: 1px dashed;
    }
  }
`;

registerStyles('vaadin-tooltip-overlay', [overlayStyles, tooltipOverlayStyles], {
  moduleId: 'vaadin-tooltip-overlay-styles',
});

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
class TooltipOverlay extends PositionMixin(OverlayMixin(DirMixin(ThemableMixin(PolymerElement)))) {
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

defineCustomElement(TooltipOverlay);
