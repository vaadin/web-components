/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbTrailOverlayStyles } from './styles/vaadin-breadcrumb-trail-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-breadcrumb-trail>` for the overflow
 * popup. Not intended to be used separately.
 *
 * @customElement vaadin-breadcrumb-trail-overlay
 * @extends HTMLElement
 * @mixes LumoInjectionMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @protected
 */
export class BreadcrumbTrailOverlay extends PositionMixin(OverlayMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-breadcrumb-trail-overlay';
  }

  static get styles() {
    return breadcrumbTrailOverlayStyles;
  }

  static get experimental() {
    return 'breadcrumbTrailComponent';
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(BreadcrumbTrailOverlay);
