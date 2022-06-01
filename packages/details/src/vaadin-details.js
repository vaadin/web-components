/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ShadowFocusMixin } from '@vaadin/field-base/src/shadow-focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ShadowFocusMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Details extends ShadowFocusMixin(ElementMixin(ThemableMixin(PolymerElement))) {
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
          aria-controls$="[[_contentId]]"
        >
          <span part="toggle" aria-hidden="true"></span>
          <span part="summary-content"><slot name="summary"></slot></span>
        </div>
      </div>
      <section id$="[[_contentId]]" part="content" aria-hidden$="[[_getAriaHidden(opened)]]">
        <slot></slot>
      </section>
    `;
  }

  static get is() {
    return 'vaadin-details';
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
        observer: '_openedChanged',
      },
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
   * Focusable element used by `ShadowFocusMixin`.
   * @return {!HTMLElement}
   * @protected
   */
  get focusElement() {
    return this.shadowRoot.querySelector('[part="summary"]');
  }

  /** @protected */
  ready() {
    super.ready();
    const uniqueId = (Details._uniqueId = 1 + Details._uniqueId || 0);
    this._contentId = `${this.constructor.is}-content-${uniqueId}`;
    // Prevent Shift + Tab on content from host blur
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

customElements.define(Details.is, Details);

export { Details };
