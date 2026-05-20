/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumbs>`. Not intended to be used separately.
 *
 * @customElement vaadin-breadcrumbs-overlay
 * @extends HTMLElement
 * @private
 */
class BreadcrumbsOverlay extends PositionMixin(OverlayMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumbs-overlay';
  }

  static get styles() {
    return [
      overlayStyles,
      css`
        [part='content'] {
          padding: var(--vaadin-item-overlay-padding, 4px);
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay" id="overlay">
        <div part="content" id="content" role="list">
          <slot></slot>
        </div>
      </div>
    `;
  }

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
}

defineCustomElement(BreadcrumbsOverlay);

export { BreadcrumbsOverlay };
