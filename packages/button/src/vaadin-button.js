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
          /* The host forwards all the properties to the [part=button] part */
          display: contents;
          position: relative;
          outline: none;
          white-space: nowrap;
          text-align: center;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='button'] {
          all: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        [part='button-inner'] {
          display: contents;
        }

        /* Ensure the button is always aligned on with other components */
        [part='button-inner']::before {
          content: '\\2003';
          display: inline-block;
          width: 0;
        }

        slot[name]::slotted(*) {
          flex: none;
        }

        slot:not([name])::slotted(*) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
      <button id="button" type="button" part="button">
        <span part="button-inner">
          <slot name="prefix"></slot>
          <slot></slot>
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
