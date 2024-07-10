/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { setAriaIDReference } from '@vaadin/a11y-base/src/aria-id-reference.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

/**
 * @polymerMixin
 */
export const ConfirmDialogMixin = (superClass) =>
  class ConfirmDialogMixinClass extends superClass {
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
         * A reference to the overlay element.
         * @private
         */
        _overlayElement: {
          type: Object,
          sync: true,
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
        '__accessibleDescriptionRefChanged(_overlayElement, _messageNodes, accessibleDescriptionRef)',
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
          this.appendChild(wrapper);
          wrapper.appendChild(node);
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

    /** @protected */
    _initOverlay(overlay) {
      overlay.addEventListener('vaadin-overlay-escape-press', this._escPressed.bind(this));
      overlay.addEventListener('vaadin-overlay-open', () => this.__onDialogOpened());
      overlay.addEventListener('vaadin-overlay-closed', () => this.__onDialogClosed());
      overlay.setAttribute('role', 'alertdialog');
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
      this.dispatchEvent(new CustomEvent('closed'));
    }

    /** @private */
    __accessibleDescriptionRefChanged(overlay, messageNodes, accessibleDescriptionRef) {
      if (!overlay || !messageNodes) {
        return;
      }

      if (accessibleDescriptionRef !== undefined) {
        setAriaIDReference(overlay, 'aria-describedby', {
          newId: accessibleDescriptionRef,
          oldId: this.__oldAccessibleDescriptionRef,
          fromUser: true,
        });
      } else {
        messageNodes.forEach((node) => {
          setAriaIDReference(overlay, 'aria-describedby', { newId: node.id });
        });
      }

      this.__oldAccessibleDescriptionRef = accessibleDescriptionRef;
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
     * Fired when the confirm dialog is closed.
     *
     * @event closed
     */
  };
