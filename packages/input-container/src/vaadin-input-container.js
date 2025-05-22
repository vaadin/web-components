/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { inputContainerStyles } from './vaadin-input-container-core-styles.js';
import { InputContainerMixin } from './vaadin-input-container-mixin.js';

/**
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @mixes InputContainerMixin
 */
export class InputContainer extends InputContainerMixin(
  CSSInjectionMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-input-container';
  }

  static get styles() {
    return inputContainerStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }
}

defineCustomElement(InputContainer);
