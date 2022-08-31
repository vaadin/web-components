/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-confirm-dialog-overlay.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * `<vaadin-confirm-dialog>` is a Web Component for showing alerts and asking for user confirmation.
 *
 * ```
 * <vaadin-confirm-dialog cancel>
 *   There are unsaved changes. Do you really want to leave?
 * </vaadin-confirm-dialog>
 * ```
 *
 * ### Styling
 *
 * The `<vaadin-confirm-dialog>` is not themable. Apply styles to `<vaadin-confirm-dialog-overlay>`
 * component and use its shadow parts for styling.
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) for the overlay styling documentation.
 *
 * In addition to `<vaadin-overlay>` parts, the following parts are available for theming:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `header`         | The header element wrapper
 * `message`        | The message element wrapper
 * `footer`         | The footer element that wraps the buttons
 * `cancel-button`  | The "Cancel" button wrapper
 * `confirm-button` | The "Confirm" button wrapper
 * `reject-button`  | The "Reject" button wrapper
 *
 * Use `confirmTheme`, `cancelTheme` and `rejectTheme` properties to customize buttons theme.
 * Also, the `theme` attribute value set on `<vaadin-confirm-dialog>` is propagated to the
 * `<vaadin-confirm-dialog-overlay>` component.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * ### Custom content
 *
 * The following slots are available for providing custom content:
 *
 * Slot name         | Description
 * ------------------|---------------------------
 * `header`          | Slot for header element
 * `cancel-button`   | Slot for "Cancel" button
 * `confirm-button`  | Slot for "Confirm" button
 * `reject-button`   | Slot for "Reject" button
 *
 * @fires {Event} confirm - Fired when Confirm button was pressed.
 * @fires {Event} cancel - Fired when Cancel button or Escape key was pressed.
 * @fires {Event} reject - Fired when Reject button was pressed.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes SlotMixin
 * @mixes ElementMixin
 * @mixes ThemePropertyMixin
 */
class ConfirmDialog extends SlotMixin(ElementMixin(ThemePropertyMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host,
        [hidden] {
          display: none !important;
        }
      </style>

      <vaadin-confirm-dialog-dialog
        id="dialog"
        opened="{{opened}}"
        aria-label="[[_getAriaLabel(header)]]"
        theme$="[[_theme]]"
        no-close-on-outside-click
        no-close-on-esc="[[noCloseOnEsc]]"
      ></vaadin-confirm-dialog-dialog>

      <div hidden>
        <slot name="header"></slot>
        <slot></slot>
        <slot name="cancel-button"></slot>
        <slot name="reject-button"></slot>
        <slot name="confirm-button"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-confirm-dialog';
  }

  static get properties() {
    return {
      /**
       * True if the overlay is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
      },

      /**
       * Set the confirmation dialog title.
       * @type {string}
       */
      header: {
        type: String,
        value: '',
      },

      /**
       * Set the message or confirmation question.
       */
      message: {
        type: String,
        value: '',
      },

      /**
       * Text displayed on confirm-button.
       * This only affects the default button, custom slotted buttons will not be altered.
       * @attr {string} confirm-text
       * @type {string}
       */
      confirmText: {
        type: String,
        value: 'Confirm',
      },

      /**
       * Theme for a confirm-button.
       * This only affects the default button, custom slotted buttons will not be altered.
       * @attr {string} confirm-theme
       * @type {string}
       */
      confirmTheme: {
        type: String,
        value: 'primary',
      },

      /**
       * Set to true to disable closing dialog on Escape press
       * @attr {boolean} no-close-on-esc
       * @type {boolean}
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false,
      },

      /**
       * Whether to show cancel button or not.
       * @type {boolean}
       */
      reject: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },

      /**
       * Text displayed on reject-button.
       * This only affects the default button, custom slotted buttons will not be altered.
       * @attr {string} reject-text
       * @type {string}
       */
      rejectText: {
        type: String,
        value: 'Reject',
      },

      /**
       * Theme for a reject-button.
       * This only affects the default button, custom slotted buttons will not be altered.
       * @attr {string} reject-theme
       * @type {string}
       */
      rejectTheme: {
        type: String,
        value: 'error tertiary',
      },

      /**
       * Whether to show cancel button or not.
       * @type {boolean}
       */
      cancel: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },

      /**
       * Text displayed on cancel-button.
       * This only affects the default button, custom slotted buttons will not be altered.
       * @attr {string} cancel-text
       * @type {string}
       */
      cancelText: {
        type: String,
        value: 'Cancel',
      },

      /**
       * Theme for a cancel-button.
       * This only affects the default button, custom slotted buttons will not be altered.
       * @attr {string} cancel-theme
       * @type {string}
       */
      cancelTheme: {
        type: String,
        value: 'tertiary',
      },

      /**
       * A reference to the "Cancel" button which will be teleported to the overlay.
       * @private
       */
      _cancelButton: {
        type: HTMLElement,
        observer: '_cancelButtonChanged',
      },

      /**
       * A reference to the "Confirm" button which will be teleported to the overlay.
       * @private
       */
      _confirmButton: {
        type: HTMLElement,
        observer: '_confirmButtonChanged',
      },

      /**
       * A reference to the "header" node which will be teleported to the overlay.
       * @private
       */
      _headerNode: {
        type: HTMLElement,
      },

      /**
       * A reference to the message which will be placed in the overlay default slot.
       * @private
       */
      _messageNode: {
        type: HTMLElement,
      },

      /**
       * A reference to the "Reject" button which will be teleported to the overlay.
       * @private
       */
      _rejectButton: {
        type: HTMLElement,
        observer: '_rejectButtonChanged',
      },
    };
  }

  static get observers() {
    return [
      '__updateConfirmButton(_confirmButton, confirmText, confirmTheme)',
      '__updateCancelButton(_cancelButton, cancelText, cancelTheme, cancel)',
      '__updateHeaderNode(_headerNode, header)',
      '__updateMessageNode(_messageNode, message)',
      '__updateRejectButton(_rejectButton, rejectText, rejectTheme, reject)',
    ];
  }

  /** @protected */
  get slots() {
    // NOTE: order in which slots are listed matches the template.
    return {
      ...super.slots,
      header: () => {
        const h3 = document.createElement('h3');
        this.__defaultHeader = h3;
        return h3;
      },
      '': () => {
        const div = document.createElement('div');
        this.__defaultMessage = div;
        return div;
      },
      'cancel-button': () => {
        const button = document.createElement('vaadin-button');
        button.setAttribute('theme', this.cancelTheme);
        button.textContent = this.cancelText;
        button._isDefaultButton = true;
        return button;
      },
      'reject-button': () => {
        const button = document.createElement('vaadin-button');
        button.setAttribute('theme', this.rejectTheme);
        button.textContent = this.rejectText;
        button._isDefaultButton = true;
        return button;
      },
      'confirm-button': () => {
        const button = document.createElement('vaadin-button');
        button._isDefaultButton = true;
        return button;
      },
    };
  }

  constructor() {
    super();
    this.__slottedNodes = [];
    this._observer = new FlattenedNodesObserver(this, (info) => {
      this.__onDomChange(info.addedNodes);
    });
  }

  /** @protected */
  ready() {
    super.ready();

    this.__boundCancel = this._cancel.bind(this);
    this.__boundConfirm = this._confirm.bind(this);
    this.__boundReject = this._reject.bind(this);

    this._overlayElement = this.$.dialog.$.overlay;
    this._overlayElement.addEventListener('vaadin-overlay-escape-press', this._escPressed.bind(this));
    this._overlayElement.addEventListener('vaadin-overlay-open', () => this.__onDialogOpened());
    this._overlayElement.addEventListener('vaadin-confirm-dialog-close', () => this.__onDialogClosed());

    if (this._dimensions) {
      Object.keys(this._dimensions).forEach((name) => {
        this._setDimension(name, this._dimensions[name]);
      });
    }
  }

  /** @private */
  __onDialogOpened() {
    const overlay = this._overlayElement;

    // Teleport slotted nodes to the overlay element.
    this.__slottedNodes.forEach((node) => {
      overlay.appendChild(node);
    });

    const confirmButton = overlay.querySelector('[slot="confirm-button"]');
    if (confirmButton) {
      confirmButton.focus();
    }
  }

  /** @private */
  __onDialogClosed() {
    const nodes = this.__slottedNodes;

    // Reset the list of nodes, it will be re-created.
    this.__slottedNodes = [];

    // Move nodes from the overlay back to the host.
    nodes.forEach((node) => {
      this.appendChild(node);
    });
  }

  /** @private */
  __onDomChange(addedNodes) {
    // TODO: restore default element when a corresponding slotted element is removed.
    // Consider creating a controller to reuse custom helper logic from FieldMixin.
    addedNodes.forEach((node) => {
      this.__slottedNodes.push(node);

      const isElementNode = node.nodeType === Node.ELEMENT_NODE;
      const slotName = isElementNode ? node.getAttribute('slot') : '';

      // Handle named slots (header and buttons).
      if (slotName) {
        if (slotName.indexOf('button') >= 0) {
          const [button] = slotName.split('-');
          this[`_${button}Button`] = node;
        } else if (slotName === 'header') {
          this._headerNode = node;
        }
      } else {
        const isNotEmptyText = node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '';
        // Handle default slot (message element).
        if (isNotEmptyText || (isElementNode && node.slot === '')) {
          this._messageNode = node;
        }
      }
    });
  }

  /** @private */
  _cancelButtonChanged(button, oldButton) {
    this.__setupSlottedButton(button, oldButton, this.__boundCancel);
  }

  /** @private */
  _confirmButtonChanged(button, oldButton) {
    this.__setupSlottedButton(button, oldButton, this.__boundConfirm);
  }

  /** @private */
  _rejectButtonChanged(button, oldButton) {
    this.__setupSlottedButton(button, oldButton, this.__boundReject);
  }

  /** @private */
  __setupSlottedButton(slottedButton, currentButton, clickListener) {
    if (currentButton && currentButton.parentElement) {
      currentButton.remove();
    }

    slottedButton.addEventListener('click', clickListener);
  }

  /** @private */
  __updateCancelButton(button, cancelText, cancelTheme, showCancel) {
    if (button) {
      if (button._isDefaultButton) {
        button.textContent = cancelText;
        button.setAttribute('theme', cancelTheme);
      }
      button.toggleAttribute('hidden', !showCancel);
    }
  }

  /** @private */
  __updateConfirmButton(button, confirmText, confirmTheme) {
    if (button && button._isDefaultButton) {
      button.textContent = confirmText;
      button.setAttribute('theme', confirmTheme);
    }
  }

  /** @private */
  __updateHeaderNode(headerNode, header) {
    // Only update text content for the default header node.
    if (headerNode && headerNode === this.__defaultHeader) {
      headerNode.textContent = header;
    }
  }

  /** @private */
  __updateMessageNode(messageNode, message) {
    // Only update text content for the default message node.
    if (messageNode && messageNode === this.__defaultMessage) {
      messageNode.textContent = message;
    }
  }

  /** @private */
  __updateRejectButton(button, rejectText, rejectTheme, showReject) {
    if (button) {
      if (button._isDefaultButton) {
        button.textContent = rejectText;
        button.setAttribute('theme', rejectTheme);
      }
      button.toggleAttribute('hidden', !showReject);
    }
  }

  /** @private */
  _escPressed(event) {
    if (!event.defaultPrevented) {
      this._cancel();
    }
  }

  /** @private */
  _confirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.opened = false;
  }

  /** @private */
  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.opened = false;
  }

  /** @private */
  _reject() {
    this.dispatchEvent(new CustomEvent('reject'));
    this.opened = false;
  }

  /** @private */
  _getAriaLabel(header) {
    return header || 'confirmation';
  }

  /** @private */
  _setWidth(width) {
    this._setDimensionIfAttached('width', width);
  }

  /** @private */
  _setHeight(height) {
    this._setDimensionIfAttached('height', height);
  }

  /** @private */
  _setDimensionIfAttached(name, value) {
    if (this._overlayElement) {
      this._setDimension(name, value);
    } else {
      this._dimensions = this._dimensions || {};
      this._dimensions[name] = value;
    }
  }

  /** @private */
  _setDimension(name, value) {
    this._overlayElement.style.setProperty(`--_vaadin-confirm-dialog-content-${name}`, value);
  }

  /**
   * @event confirm
   * fired when Confirm button was pressed.
   */

  /**
   * @event cancel
   * fired when Cancel button or Escape key was pressed.
   */

  /**
   * @event reject
   * fired when Reject button was pressed.
   */
}

customElements.define(ConfirmDialog.is, ConfirmDialog);

export { ConfirmDialog };
