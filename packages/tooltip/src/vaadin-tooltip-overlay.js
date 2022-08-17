/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/vaadin-overlay/src/vaadin-overlay-position-mixin.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-tooltip-overlay',
  css`
    :host([position='top']) [part='overlay'],
    :host([position='bottom']) [part='overlay'] {
      margin: 2px 0;
    }

    :host([position='start']) [part='overlay'],
    :host([position='end']) [part='overlay'] {
      margin: 0 2px;
    }
  `,
  { moduleId: 'vaadin-tooltip-overlay-styles' },
);

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

  /** @protected */
  ready() {
    super.ready();

    this.__resizeObserver = new ResizeObserver(() => {
      if (this.opened) {
        this._updatePosition();
      }
    });

    this.__resizeObserver.observe(this.$.overlay);
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

    const targetRect = this.positionTarget.getBoundingClientRect();
    const overlayRect = this.$.overlay.getBoundingClientRect();

    if (this.noVerticalOverlap) {
      if (this.style.left) {
        const left = targetRect.left + targetRect.width / 2 - overlayRect.width / 2;
        this.style.left = `${left < targetRect.left ? targetRect.left : left}px`;
      }

      if (this.style.right) {
        this.style.right = `${targetRect.left + targetRect.width / 2 - overlayRect.width / 2}px`;
      }
    }

    if (this.noHorizontalOverlap) {
      if (this.style.bottom) {
        this.style.bottom = `${parseFloat(this.style.bottom) + targetRect.height / 2 - overlayRect.height / 2}px`;
      }
    }
  }
}

customElements.define(TooltipOverlay.is, TooltipOverlay);
