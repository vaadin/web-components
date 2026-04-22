/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbOverlayStyles } from './styles/vaadin-breadcrumb-overlay-base-styles.js';
import { BreadcrumbOverlayMixin } from './vaadin-breadcrumb-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumb>` to host the list of
 * collapsed items in the overflow menu. Not intended to be used separately.
 *
 * @customElement vaadin-breadcrumb-overlay
 * @extends HTMLElement
 * @mixes BreadcrumbOverlayMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class BreadcrumbOverlay extends BreadcrumbOverlayMixin(
  OverlayMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-breadcrumb-overlay';
  }

  static get styles() {
    return [overlayStyles, breadcrumbOverlayStyles];
  }

  static get experimental() {
    return 'breadcrumbComponent';
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

defineCustomElement(BreadcrumbOverlay);

export { BreadcrumbOverlay };
