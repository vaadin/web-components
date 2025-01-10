/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { MapMixin } from './vaadin-map-mixin.js';
import { mapStyles } from './vaadin-map-styles.js';

/**
 * LitElement based version of `<vaadin-map>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class Map extends MapMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-map';
  }

  static get cvdlName() {
    return 'vaadin-map';
  }

  static get styles() {
    return mapStyles;
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(Map);

export { Map };
