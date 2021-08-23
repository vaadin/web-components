/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { addListener } from '@polymer/polymer/lib/utils/gestures.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-button>` is a Web Component providing an accessible and customizable button.
 *
 * ```html
 * <vaadin-button>
 * </vaadin-button>
 * ```
 *
 * ```js
 * document.querySelector('vaadin-button').addEventListener('click', () => alert('Hello World!'));
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `label` | The label (text) inside the button
 * `prefix` | A slot for e.g. an icon before the label
 * `suffix` | A slot for e.g. an icon after the label
 *
 *
 * The following attributes are exposed for styling:
 *
 * Attribute | Description
 * --------- | -----------
 * `active` | Set when the button is pressed down, either with mouse, touch or the keyboard.
 * `disabled` | Set when the button is disabled.
 * `focus-ring` | Set when the button is focused using the keyboard.
 * `focused` | Set when the button is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControlStateMixin
 * @mixes ThemableMixin
 * @mixes GestureEventListeners
 */
class ButtonElement extends ElementMixin(ControlStateMixin(ThemableMixin(GestureEventListeners(PolymerElement)))) {
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
        .vaadin-button-container::before {
          content: '\\2003';
          display: inline-block;
          width: 0;
        }

        .vaadin-button-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          height: 100%;
          min-height: inherit;
          text-shadow: inherit;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
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

        #button {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: inherit;
        }
      </style>
      <div class="vaadin-button-container">
        <div part="prefix">
          <slot name="prefix"></slot>
        </div>
        <div part="label">
          <slot></slot>
        </div>
        <div part="suffix">
          <slot name="suffix"></slot>
        </div>
      </div>
      <button id="button" type="button"></button>
    `;
  }

  static get is() {
    return 'vaadin-button';
  }

  ready() {
    super.ready();

    // Leaving default role in the native button, makes navigation announcement
    // being different when using focus navigation (tab) versus using normal
    // navigation (arrows). The first way announces the label on a button
    // since the focus is moved programmatically, and the second on a group.
    this.setAttribute('role', 'button');
    this.$.button.setAttribute('role', 'presentation');

    this._addActiveListeners();
  }

  /**
   * @protected
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    // `active` state is preserved when the element is disconnected between keydown and keyup events.
    // reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
    this.toggleAttribute('active', false);
  }

  /** @private */
  _addActiveListeners() {
    addListener(this, 'down', () => !this.disabled && this.setAttribute('active', ''));
    addListener(this, 'up', () => this.removeAttribute('active'));
    this.addEventListener(
      'keydown',
      (e) => !this.disabled && [13, 32].indexOf(e.keyCode) >= 0 && this.setAttribute('active', '')
    );
    this.addEventListener('keyup', () => this.removeAttribute('active'));
    this.addEventListener('blur', () => this.removeAttribute('active'));
  }

  /**
   * @protected
   * @return {Element}
   */
  get focusElement() {
    return this.$.button;
  }
}

customElements.define(ButtonElement.is, ButtonElement);

export { ButtonElement };
