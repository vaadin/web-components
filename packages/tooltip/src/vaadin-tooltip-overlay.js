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
    :host {
      align-items: flex-start;
      justify-content: flex-start;
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
}

customElements.define(TooltipOverlay.is, TooltipOverlay);
