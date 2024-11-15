/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CrudEditMixin } from './vaadin-crud-edit-mixin.js';

/**
 * LitElement based version of `<vaadin-crud-edit>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
registerStyles(
  'vaadin-crud-edit',
  css`
    :host {
      display: block;
    }
  `,
  {
    moduleId: 'vaadin-crud-edit-styles',
  },
);

/**
 * `<vaadin-crud-edit>` is a helper element for `<vaadin-grid-column>` that provides
 * an easily themable button that fires an `edit` event with the row item as detail
 * when clicked.
 *
 * Typical usage is in a `<vaadin-grid-column>` of a custom `<vaadin-grid>` inside
 * a `<vaadin-crud>` to enable editing.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes CrudEditMixin
 * @mixes ThemableMixin
 */
class CrudEdit extends CrudEditMixin(PolylitMixin(LitElement)) {
  render() {
    return html`
      <div part="icon"></div>
      <slot name="tooltip"></slot>
    `;
  }
  static get is() {
    return 'vaadin-crud-edit';
  }

  /** @protected */

  /**
   * Fired when user on the icon.
   *
   * @event edit
   * @param {Object} detail.item the item to edit
   * @param {Object} detail.index the index of the item in the data set
   */
}
defineCustomElement(CrudEdit);
export { CrudEdit };
