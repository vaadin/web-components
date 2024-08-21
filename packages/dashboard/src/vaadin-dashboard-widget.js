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
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TitleController } from './title-controller.js';

/**
 * A Widget component for use with the Dashboard component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 */
class DashboardWidget extends ControllerMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-dashboard-widget';
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

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #content {
        flex: 1;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The title of the widget.
       */
      widgetTitle: {
        type: String,
        value: '',
        observer: '__onWidgetTitleChanged',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <header>
        <slot name="title" @slotchange="${this.__onTitleSlotChange}"></slot>
        <slot name="header"></slot>
        <div id="header-actions"></div>
      </header>

      <div id="content">
        <slot></slot>
      </div>
    `;
  }

  constructor() {
    super();
    this.__titleController = new TitleController(this);
    this.__titleController.addEventListener('slot-content-changed', (event) => {
      const { node } = event.target;
      if (node) {
        this.setAttribute('aria-labelledby', node.id);
      }
    });
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__titleController);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'article');
    }
  }

  /** @private */
  __onWidgetTitleChanged(widgetTitle) {
    this.__titleController.setWidgetTitle(widgetTitle);
  }
}

defineCustomElement(DashboardWidget);

export { DashboardWidget };
