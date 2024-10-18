/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { overlayPosition } from './vaadin-overlay-position-directive.js';
import { PositionPropertiesMixin } from './vaadin-overlay-position-properties-mixin.js';

/**
 * An internal overlay used by `vaadin-native-popover`.
 */
class NativePopoverOverlay extends PositionPropertiesMixin(ThemableMixin(PolylitMixin(LitElement))) {
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
        display: contents;
      }

      [popover] {
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

      :host([opened]) [popover] {
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

    this.__popoverRef = createRef();

    this.__onGlobalClick = this.__onGlobalClick.bind(this);
    this.__onGlobalKeyDown = this.__onGlobalKeyDown.bind(this);
  }

  /** @protected */
  render() {
    return html`
      <div
        popover="manual"
        @toggle="${this.__onToggle}"
        ${ref(this.__popoverRef)}
        ${overlayPosition(
          this.opened,
          this.positionTarget,
          this.noHorizontalOverlap,
          this.noVerticalOverlap,
          this.horizontalAlign,
          this.verticalAlign,
          this.requiredVerticalSpace,
        )}
      >
        <div part="overlay">
          <div part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

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
      this.__popoverRef.value.showPopover();
      document.addEventListener('keydown', this.__onGlobalKeyDown, true);
    } else if (oldOpened) {
      this.__popoverRef.value.hidePopover();
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
      !event.composedPath().some((el) => el === this.__popoverRef.value || el === this.positionTarget) &&
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
