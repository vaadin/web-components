/**
 * @license
 * Copyright (c) 2022 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/tabs/src/vaadin-lit-tabs.js';
import './vaadin-lit-tabsheet-scroller.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TabSheetMixin } from './vaadin-tabsheet-mixin.js';

/**
 * LitElement based version of `<vaadin-tabsheet>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class TabSheet extends TabSheetMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-tabsheet';
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part='tabs-container'] {
        position: relative;
        display: flex;
        align-items: center;
      }

      ::slotted([slot='tabs']) {
        flex: 1;
        align-self: stretch;
        min-width: 8em;
      }

      [part='content'] {
        position: relative;
        flex: 1;
        box-sizing: border-box;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <div part="tabs-container">
        <slot name="prefix"></slot>
        <slot name="tabs"></slot>
        <slot name="suffix"></slot>
      </div>

      <vaadin-tabsheet-scroller part="content">
        <div part="loader"></div>
        <slot id="panel-slot"></slot>
      </vaadin-tabsheet-scroller>
    `;
  }
}

defineCustomElement(TabSheet);

export { TabSheet };
