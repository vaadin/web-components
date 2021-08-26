/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { TabindexMixin } from '@vaadin/field-base/src/tabindex-mixin.js';
import { ActiveMixin } from '@vaadin/field-base/src/active-mixin.js';
import { FocusMixin } from '@vaadin/field-base/src/focus-mixin.js';

class Button extends ActiveMixin(TabindexMixin(FocusMixin(ElementMixin(ThemableMixin(PolymerElement))))) {
  static get is() {
    return 'vaadin-button';
  }

  static get version() {
    return '22.0.0-alpha1';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: relative;
          outline: none;
          white-space: nowrap;
        }

        :host([hidden]) {
          display: none !important;
        }

        /* Ensure the button is always aligned on the baseline */
        [part='button']::before {
          content: '\\2003';
          display: inline-block;
          width: 0;
        }

        [part='button'] {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          height: 100%;
          min-height: inherit;
          text-shadow: inherit;
          background: transparent;
          padding: 0;
          border: none;
          box-shadow: none;
        }

        [part='prefix'],
        [part='suffix'] {
          flex: none;
        }

        [part='label'] {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
      <div part="button">
        <span part="prefix">
          <slot name="prefix"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="suffix">
          <slot name="suffix"></slot>
        </span>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "button".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
  }
}

export { Button };
