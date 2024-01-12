/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { VirtualListMixin } from './vaadin-virtual-list-mixin.js';
import { virtualListStyles } from './vaadin-virtual-list-styles.js';

/**
 * LitElement based version of `<vaadin-virtual-list>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class VirtualList extends VirtualListMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-virtual-list';
  }

  static get styles() {
    return [virtualListStyles];
  }

  render() {
    return html`
      <div id="items">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(VirtualList);

export { VirtualList };
