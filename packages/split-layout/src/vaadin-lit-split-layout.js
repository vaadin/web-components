/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SplitLayoutMixin } from './vaadin-split-layout-mixin.js';
import { splitLayoutStyles } from './vaadin-split-layout-styles.js';

/**
 * LitElement based version of `<vaadin-split-layout>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class SplitLayout extends SplitLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-split-layout';
  }

  static get styles() {
    return splitLayoutStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot id="primary" name="primary"></slot>
      <div part="splitter" id="splitter">
        <div part="handle"></div>
      </div>
      <slot id="secondary" name="secondary"></slot>
    `;
  }
}

defineCustomElement(SplitLayout);

export { SplitLayout };
