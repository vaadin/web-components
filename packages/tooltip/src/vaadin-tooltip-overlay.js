/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { PopoverOverlayMixin } from '@vaadin/popover/src/vaadin-popover-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { tooltipOverlayStyles } from './styles/vaadin-tooltip-overlay-base-styles.js';

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
class TooltipOverlay extends PopoverOverlayMixin(
  DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-tooltip-overlay';
  }

  static get styles() {
    return [overlayStyles, tooltipOverlayStyles];
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }

  /**
   * Override method inherited from `PositionMixin` to handle
   * target visibility change in the tooltip logic.
   * @param {boolean} isIntersecting
   * @protected
   * @override
   */
  _onTargetVisibilityChange(isIntersecting) {
    this.dispatchEvent(
      new CustomEvent('target-visibility-change', {
        detail: {
          isVisible: isIntersecting,
        },
      }),
    );
  }
}

defineCustomElement(TooltipOverlay);
