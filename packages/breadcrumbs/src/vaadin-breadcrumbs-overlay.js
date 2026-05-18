/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { breadcrumbsOverlayStyles } from './styles/vaadin-breadcrumbs-overlay-base-styles.js';
import { BreadcrumbsOverlayMixin } from './vaadin-breadcrumbs-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumbs>`. Not intended to be used separately.
 *
 * @customElement vaadin-breadcrumbs-overlay
 * @extends HTMLElement
 * @private
 */
class BreadcrumbsOverlay extends BreadcrumbsOverlayMixin(
  OverlayMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-breadcrumbs-overlay';
  }

  static get styles() {
    return [overlayStyles, breadcrumbsOverlayStyles];
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
}

defineCustomElement(BreadcrumbsOverlay);

export { BreadcrumbsOverlay };
