/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-confirm-dialog-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { setAriaIDReference } from '@vaadin/a11y-base/src/aria-id-reference.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * `<vaadin-confirm-dialog>` is a Web Component for showing alerts and asking for user confirmation.
 *
 * ```
 * <vaadin-confirm-dialog cancel-button-visible>
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
 * @mixes ControllerMixin
 * @mixes ElementMixin
 * @mixes ThemePropertyMixin
 */
class ConfirmDialog extends ElementMixin(ThemePropertyMixin(ControllerMixin(PolymerElement))) {
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
        overlay-class="[[overlayClass]]"
        aria-label="[[_getAriaLabel(header)]]"
        theme$="[[_theme]]"
        no-close-on-outside-click
        no-close-on-esc="[[noCloseOnEsc]]"
        content-height="[[_contentHeight]]"
        content-width="[[_contentWidth]]"
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
       * Sets the `aria-describedby` attribute of the overlay element.
       *
       * By default, all elements inside the message area are linked
       * through the `aria-describedby` attribute. However, there are
       * cases where this can confuse screen reader users (e.g. the dialog
       * may present a password confirmation form). For these cases,
       * it's better to associate only the elements that will help describe
       * the confirmation dialog through this API.
       */
      accessibleDescriptionRef: {
        type: String,
      },
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
       * Whether to show reject button or not.
       * @attr {boolean} reject-button-visible
       * @type {boolean}
       */
      rejectButtonVisible: {
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
       * @attr {boolean} cancel-button-visible
       * @type {boolean}
       */
      cancelButtonVisible: {
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
       * A space-delimited list of CSS class names
       * to set on the underlying overlay element.
       *
       * @attr {string} overlay-class
       */
      overlayClass: {
        type: String,
      },

      /**
       * A reference to the "Cancel" button which will be teleported to the overlay.
       * @private
       */
      _cancelButton: {
        type: Object,
      },

      /**
       * A reference to the "Confirm" button which will be teleported to the overlay.
       * @private
       */
      _confirmButton: {
        type: Object,
      },

      /**
       * A reference to the "header" node which will be teleported to the overlay.
       * @private
       */
      _headerNode: {
        type: Object,
      },

      /**
       * A list of message nodes which will be placed in the overlay default slot.
       * @private
       */
      _messageNodes: {
        type: Array,
        value: () => [],
      },

      /**
       * A reference to the "Reject" button which will be teleported to the overlay.
       * @private
       */
      _rejectButton: {
        type: Object,
      },

      /**
       * Height to be set on the overlay content.
       * @protected
       */
      _contentHeight: {
        type: String,
      },

      /**
       * Width to be set on the overlay content.
       * @protected
       */
      _contentWidth: {
        type: String,
      },
    };
  }

  static get observers() {
    return [
      '__updateConfirmButton(_confirmButton, confirmText, confirmTheme)',
      '__updateCancelButton(_cancelButton, cancelText, cancelTheme, cancelButtonVisible)',
      '__updateHeaderNode(_headerNode, header)',
      '__updateMessageNodes(_messageNodes, message)',
      '__updateRejectButton(_rejectButton, rejectText, rejectTheme, rejectButtonVisible)',
      '__accessibleDescriptionRefChanged(_overlayElement, accessibleDescriptionRef)',
    ];
  }

  constructor() {
    super();

    this.__cancel = this.__cancel.bind(this);
    this.__confirm = this.__confirm.bind(this);
    this.__reject = this.__reject.bind(this);
  }

  get __slottedNodes() {
    return [this._headerNode, ...this._messageNodes, this._cancelButton, this._confirmButton, this._rejectButton];
  }

  /** @protected */
  ready() {
    super.ready();

    this._overlayElement = this.$.dialog.$.overlay;
    this._overlayElement.addEventListener('vaadin-overlay-escape-press', this._escPressed.bind(this));
    this._overlayElement.addEventListener('vaadin-overlay-open', () => this.__onDialogOpened());
    this._overlayElement.addEventListener('vaadin-overlay-closed', () => this.__onDialogClosed());
    this._overlayElement.setAttribute('role', 'alertdialog');

    this._headerController = new SlotController(this, 'header', 'h3', {
      initializer: (node) => {
        this._headerNode = node;
      },
    });
    this.addController(this._headerController);

    this._messageController = new SlotController(this, '', 'div', {
      // Allow providing multiple custom nodes in the default slot
      multiple: true,
      observe: false,
      initializer: (node) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'contents';
        const wrapperId = `confirm-dialog-message-${generateUniqueId()}`;
        wrapper.id = wrapperId;
        wrapper.appendChild(node);
        this.appendChild(wrapper);
        setAriaIDReference(this._overlayElement, 'aria-describedby', { newId: wrapperId });
        this._messageNodes = [...this._messageNodes, wrapper];
      },
    });
    this.addController(this._messageController);

    // NOTE: order in which buttons are added should match the order of slots in template
    this._cancelController = new SlotController(this, 'cancel-button', 'vaadin-button', {
      initializer: (button) => {
        this.__setupSlottedButton('cancel', button);
      },
    });
    this.addController(this._cancelController);

    this._rejectController = new SlotController(this, 'reject-button', 'vaadin-button', {
      initializer: (button) => {
        this.__setupSlottedButton('reject', button);
      },
    });
    this.addController(this._rejectController);

    this._confirmController = new SlotController(this, 'confirm-button', 'vaadin-button', {
      initializer: (button) => {
        this.__setupSlottedButton('confirm', button);
      },
    });
    this.addController(this._confirmController);
  }

  /** @private */
  __accessibleDescriptionRefChanged(_overlayElement, accessibleDescriptionRef) {
    if (!_overlayElement || (!accessibleDescriptionRef && !this.__oldAccessibleDescriptionRef)) {
      return;
    }
    setAriaIDReference(this._overlayElement, 'aria-describedby', {
      newId: accessibleDescriptionRef,
      oldId: this.__oldAccessibleDescriptionRef,
      fromUser: true,
    });
    this.__oldAccessibleDescriptionRef = accessibleDescriptionRef;
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
    // Move nodes from the overlay back to the host.
    this.__slottedNodes.forEach((node) => {
      this.appendChild(node);
    });
  }

  /** @private */
  __setupSlottedButton(type, button) {
    const property = `_${type}Button`;
    const listener = `__${type}`;

    if (this[property] && this[property] !== button) {
      this[property].remove();
    }

    button.addEventListener('click', this[listener]);
    this[property] = button;
  }

  /** @private */
  __updateCancelButton(button, cancelText, cancelTheme, showCancel) {
    if (button) {
      if (button === this._cancelController.defaultNode) {
        button.textContent = cancelText;
        button.setAttribute('theme', cancelTheme);
      }
      button.toggleAttribute('hidden', !showCancel);
    }
  }

  /** @private */
  __updateConfirmButton(button, confirmText, confirmTheme) {
    if (button && button === this._confirmController.defaultNode) {
      button.textContent = confirmText;
      button.setAttribute('theme', confirmTheme);
    }
  }

  /** @private */
  __updateHeaderNode(headerNode, header) {
    // Only update text content for the default header node.
    if (headerNode && headerNode === this._headerController.defaultNode) {
      headerNode.textContent = header;
    }
  }

  /** @private */
  __updateMessageNodes(nodes, message) {
    if (nodes && nodes.length > 0) {
      const defaultWrapperNode = nodes.find(
        (node) => this._messageController.defaultNode && node === this._messageController.defaultNode.parentElement,
      );
      if (defaultWrapperNode) {
        defaultWrapperNode.firstChild.textContent = message;
      }
    }
  }

  /** @private */
  __updateRejectButton(button, rejectText, rejectTheme, showReject) {
    if (button) {
      if (button === this._rejectController.defaultNode) {
        button.textContent = rejectText;
        button.setAttribute('theme', rejectTheme);
      }
      button.toggleAttribute('hidden', !showReject);
    }
  }

  /** @private */
  _escPressed(event) {
    if (!event.defaultPrevented) {
      this.__cancel();
    }
  }

  /** @private */
  __confirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.opened = false;
  }

  /** @private */
  __cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.opened = false;
  }

  /** @private */
  __reject() {
    this.dispatchEvent(new CustomEvent('reject'));
    this.opened = false;
  }

  /** @private */
  _getAriaLabel(header) {
    return header || 'confirmation';
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
