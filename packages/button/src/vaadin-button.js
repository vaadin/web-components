/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ActiveMixin } from '@vaadin/field-base/src/active-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

class Button extends ControlStateMixin(ActiveMixin(ElementMixin(ThemableMixin(PolymerElement)))) {
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
          padding: 0;
          width: 100%;
          height: 100%;
          min-height: inherit;
          background: transparent;
          box-shadow: none;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
          color: inherit;
          text-shadow: inherit;
          text-align: center;
          text-transform: inherit;
          letter-spacing: inherit;
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
      <button id="button" type="button" part="button">
        <span part="prefix">
          <slot name="prefix"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="suffix">
          <slot name="suffix"></slot>
        </span>
      </button>
    `;
  }

  /**
   * A getter that returns the native button as a focusable element for ControlStateMixin.
   *
   * @protected
   * @override
   * @return {HTMLButtonElement}
   */
  get focusElement() {
    return this.$.button;
  }
}

export { Button };
