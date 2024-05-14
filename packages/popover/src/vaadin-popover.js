/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';

/**
 * `<vaadin-popover>` is a Web Component for creating overlays
 * that are positioned next to specified DOM element (target).
 *
 * Unlike `<vaadin-tooltip>`, the popover supports rich content.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class Popover extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-popover';
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(Popover);

export { Popover };
