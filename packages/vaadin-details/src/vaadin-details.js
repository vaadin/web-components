/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

/**
 * `<vaadin-details>` is a Web Component which the creates an
 * expandable panel similar to `<details>` HTML element.
 *
 * ```
 * <vaadin-details>
 *   <div slot="summary">Expandable Details</div>
 *   Toggle using mouse, Enter and Space keys.
 * </vaadin-details>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name        | Description
 * -----------------|----------------
 * `summary`        | The element used to open and close collapsible content.
 * `toggle`         | The element used as indicator, can represent an icon.
 * `summary-content`| The wrapper for the slotted summary content.
 * `content`        | The wrapper for the collapsible details content.
 *
 * The following attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `opened`     | Set when the collapsible content is expanded and visible.
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ControlStateMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DetailsElement extends ControlStateMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='content'] {
          display: none;
          overflow: hidden;
        }

        [part='summary'][disabled] {
          pointer-events: none;
        }

        :host([opened]) [part='content'] {
          display: block;
          overflow: visible;
        }
      </style>
      <div role="heading">
        <div
          role="button"
          part="summary"
          on-click="_onToggleClick"
          on-keydown="_onToggleKeyDown"
          disabled$="[[disabled]]"
          aria-expanded$="[[_getAriaExpanded(opened)]]"
        >
          <span part="toggle"></span>
          <span part="summary-content"><slot name="summary"></slot></span>
        </div>
      </div>
      <div part="content" aria-hidden$="[[_getAriaHidden(opened)]]">
        <slot></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-details';
  }

  static get version() {
    return '1.2.0';
  }

  static get properties() {
    return {
      /**
       * If true, the details content is visible.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
        observer: '_openedChanged'
      }
    };
  }

  /**
   * @return {!HTMLElement}
   * @protected
   */
  get _collapsible() {
    return this.shadowRoot.querySelector('[part="content"]');
  }

  /**
   * Focusable element used by vaadin-control-state-mixin
   * @return {!HTMLElement}
   * @protected
   */
  get focusElement() {
    return this.shadowRoot.querySelector('[part="summary"]');
  }

  ready() {
    super.ready();
    // prevent Shift + Tab on content from host blur
    this._collapsible.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.keyCode === 9) {
        e.stopPropagation();
      }
    });
  }

  /** @private */
  _getAriaExpanded(opened) {
    return opened ? 'true' : 'false';
  }

  /** @private */
  _getAriaHidden(opened) {
    return opened ? 'false' : 'true';
  }

  /** @private */
  _openedChanged(opened) {
    this._collapsible.style.maxHeight = opened ? '' : '0px';
  }

  /** @private */
  _onToggleClick() {
    this.opened = !this.opened;
  }

  /** @private */
  _onToggleKeyDown(e) {
    if ([13, 32].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      this.opened = !this.opened;
    }
  }
}

customElements.define(DetailsElement.is, DetailsElement);

export { DetailsElement };
