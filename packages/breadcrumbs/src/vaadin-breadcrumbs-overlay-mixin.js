/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * A mixin providing common breadcrumbs overlay functionality.
 *
 * @polymerMixin
 * @mixes PositionMixin
 */
export const BreadcrumbsOverlayMixin = (superClass) =>
  class BreadcrumbsOverlayMixinClass extends PositionMixin(superClass) {
    /**
     * Override the method inherited from `OverlayMixin` to keep the
     * overlay open when the overflow button (the position target) is
     * clicked. The breadcrumbs container handles toggling instead.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldCloseOnOutsideClick(event) {
      const eventPath = event.composedPath();
      return !eventPath.includes(this.positionTarget) && !eventPath.includes(this);
    }

    /**
     * Override the content root inherited from `OverlayFocusMixin` to
     * point at the breadcrumbs owner. The overlay items are rendered
     * into the breadcrumbs' own light DOM with `slot="overlay"`, then
     * forwarded into the overlay through a nested slot, so the actual
     * focused element on overlay open lives under the owner — not under
     * the overlay element itself. Using the owner as `_contentRoot`
     * lets `_shouldRestoreFocus()` correctly recognize focus inside the
     * overlay's items and restore focus to the overflow button on close.
     *
     * @protected
     * @override
     */
    get _contentRoot() {
      return this.owner || this;
    }
  };
