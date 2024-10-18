/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { PositionMixin } from './vaadin-overlay-position-mixin.js';

/**
 * An internal overlay used by `vaadin-native-popover`.
 */
class NativePopoverOverlay extends PositionMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-native-popover-overlay';
  }

  static get properties() {
    return {
      /**
       * True if the overlay is opened, false otherwise.
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
        observer: '__openedChanged',
      },

      /**
       * Set to true to disable closing overlay on outside click.
       *
       * @attr {boolean} no-close-on-outside-click
       */
      noCloseOnOutsideClick: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to disable closing overlay on Escape press.
       *
       * @attr {boolean} no-close-on-esc
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: auto;
        height: auto;
        border: none;
        margin: 0;
        padding: 0;
        overflow: visible;
      }

      :host([opened]) {
        display: flex;
        flex-direction: column;
      }

      [part='overlay'] {
        width: fit-content;
        height: fit-content;
      }
    `;
  }

  constructor() {
    super();

    this.__onGlobalClick = this.__onGlobalClick.bind(this);
    this.__onGlobalKeyDown = this.__onGlobalKeyDown.bind(this);
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay">
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (!this.popover) {
      this.popover = 'manual';
    }

    document.documentElement.addEventListener('click', this.__onGlobalClick, true);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    document.documentElement.removeEventListener('click', this.__onGlobalClick, true);

    this.opened = false;
  }

  /** @private */
  __openedChanged(opened, oldOpened) {
    if (opened) {
      this.showPopover();
      document.addEventListener('keydown', this.__onGlobalKeyDown, true);
    } else if (oldOpened) {
      this.hidePopover();
      document.removeEventListener('keydown', this.__onGlobalKeyDown, true);
    }
  }

  /**
   * Native popover closes on outside click and there is no way to prevent this
   * by cancelling `beforetoggle`, see https://github.com/whatwg/html/issues/8973
   * So we set `popover="manual"` and a custom global listener to handle closing.
   * @private
   */
  __onGlobalClick(event) {
    if (
      this.opened &&
      !event.composedPath().some((el) => el === this || el === this.positionTarget) &&
      !this.noCloseOnOutsideClick
    ) {
      this.opened = false;
    }
  }

  /**
   * Native popover closes on Escape press and there is no way to prevent this
   * by cancelling `beforetoggle`, see https://github.com/whatwg/html/issues/8973
   * So we set `popover="manual"` and a custom global listener to handle closing.
   * @private
   */
  __onGlobalKeyDown(event) {
    if (event.key === 'Escape' && this.opened && !this.noCloseOnEsc) {
      // Prevent closing parent overlay (e.g. dialog)
      event.stopPropagation();
      this.opened = false;
    }
  }

  /** @private */
  __onToggle(event) {
    if (event.newState === 'closed' && this.opened) {
      this.opened = false;
    }
  }
}

defineCustomElement(NativePopoverOverlay);

export { NativePopoverOverlay };
