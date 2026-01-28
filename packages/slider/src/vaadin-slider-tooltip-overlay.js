/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sliderTooltipOverlayStyles } from './styles/vaadin-slider-tooltip-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-slider-tooltip>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @mixes ThemableMixin
 * @private
 */
class SliderTooltipOverlay extends PositionMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-slider-tooltip-overlay';
  }

  static get styles() {
    return sliderTooltipOverlayStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
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
   * Override method from `OverlayMixin` to not close on outside click.
   * The tooltip is controlled by the slider.
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldCloseOnOutsideClick() {
    return false;
  }

  /**
   * @protected
   * @override
   */
  _updatePosition() {
    super._updatePosition();

    if (!this.positionTarget || !this.opened) {
      return;
    }

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
}

defineCustomElement(SliderTooltipOverlay);

export { SliderTooltipOverlay };
