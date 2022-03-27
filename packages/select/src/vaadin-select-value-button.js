/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { TabindexMixin } from '@vaadin/component-base/src/tabindex-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-select-value-button',
  css`
    :host {
      min-width: 0;
      width: 0;
    }

    ::slotted(:not([slot])) {
      padding-left: 0;
      padding-right: 0;
      flex: auto;
    }

    /* placeholder styles */
    ::slotted(:not([slot]):not([selected])) {
      line-height: 1;
    }

    [part='label'] {
      width: 100%;
      padding: 0;
      line-height: inherit;
    }
  `,
  { moduleId: 'vaadin-select-value-button-styles' }
);

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ActiveMixin
 * @mixes TabindexMixin
 * @mixes FocusMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectValueButton extends ActiveMixin(TabindexMixin(FocusMixin(ThemableMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-select-value-button';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: relative;
          outline: none;
          white-space: nowrap;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }

        .vaadin-button-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: inherit;
          width: 100%;
          height: 100%;
          min-height: inherit;
          background: transparent;
          padding: 0;
        }

        [part='label'] {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
      <div class="vaadin-button-container">
        <span part="label">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

customElements.define(SelectValueButton.is, SelectValueButton);
