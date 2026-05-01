/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { breadcrumbTrailStyles } from './styles/vaadin-breadcrumb-trail-base-styles.js';

/**
 * `<vaadin-breadcrumb-trail>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * @customElement vaadin-breadcrumb-trail
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class BreadcrumbTrail extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-breadcrumb-trail';
  }

  static get styles() {
    return breadcrumbTrailStyles;
  }

  static get experimental() {
    return 'breadcrumbTrailComponent';
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(BreadcrumbTrail);

export { BreadcrumbTrail };
