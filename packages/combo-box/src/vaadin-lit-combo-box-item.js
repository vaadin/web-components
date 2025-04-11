/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxItemMixin } from './vaadin-combo-box-item-mixin.js';

/**
 * LitElement based version of `<vaadin-combo-box-item>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
export class ComboBoxItem extends ComboBoxItemMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-combo-box-item';
  }

  static get styles() {
    return css`
      :host {
        align-items: center;
        box-sizing: border-box;
        display: flex;
        gap: var(--vaadin-combo-box-item-gap, 0 var(--_vaadin-gap-container-inline));
        height: var(--vaadin-combo-box-item-height, auto);
        padding: var(--vaadin-combo-box-item-padding, var(--_vaadin-padding-container));
      }

      :host([hidden]) {
        display: none;
      }

      [part='checkmark'] {
        height: var(--vaadin-icon-size, 1lh);
        mask-image: var(--_vaadin-icon-checkmark);
        width: var(--vaadin-icon-size, 1lh);
      }

      :host([selected]) [part='checkmark'] {
        background: var(--_vaadin-color-subtle);
      }

      [part='content'] {
        flex: 1;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(ComboBoxItem);
