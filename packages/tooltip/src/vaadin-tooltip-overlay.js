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
}

customElements.define(TooltipOverlay.is, TooltipOverlay);
