/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { horizontalLayoutStyles } from './vaadin-horizontal-layout-styles.js';

/**
 * LitElement based version of `<vaadin-horizontal-layout>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class HorizontalLayout extends ThemableMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-horizontal-layout';
  }

  static get styles() {
    return horizontalLayoutStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot></slot>
      <slot name="middle"></slot>
      <slot name="end"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    const endSlot = this.shadowRoot.querySelector('[name="end"]');
    this.__endSlotObserver = new SlotObserver(endSlot, ({ currentNodes }) => {
      this.toggleAttribute('has-end-children', currentNodes.length > 0);
    });
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
