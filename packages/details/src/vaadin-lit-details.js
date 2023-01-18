/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-details-summary.js';
import { html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { styles, template } from './lib/details-base.js';
import { DetailsMixin } from './vaadin-details-mixin.js';

/**
 * LitElement based version of `<vaadin-details>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 *
 * @private
 */
class Details extends DetailsMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-details';
  }

  static get styles() {
    return styles;
  }

  /** @protected */
  render() {
    return template(html);
  }
}

customElements.define(Details.is, Details);

export { Details };
