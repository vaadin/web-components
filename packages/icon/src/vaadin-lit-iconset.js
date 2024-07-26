/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { IconsetMixin } from './vaadin-iconset-mixin.js';

/**
 * LitElement based version of `<vaadin-iconset>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Iconset extends IconsetMixin(ElementMixin(PolylitMixin(LitElement))) {
  render() {
    return null;
  }

  static get is() {
    return 'vaadin-iconset';
  }
}

defineCustomElement(Iconset);

export { Iconset };
