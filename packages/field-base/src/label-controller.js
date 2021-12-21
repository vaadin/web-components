/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotController {
  constructor(host) {
    super(
      host,
      'label',
      () => document.createElement('label'),
      (_host, node) => {
        // Set ID attribute or use the existing one.
        this.__updateLabelId(node);

        // Set text content for the default label.
        this.__applyDefaultLabel(this.label, node);

        this.__observeLabel(node);
      }
    );
  }

  /** @protected */
  get uniqueId() {
    return SlotController.labelId;
  }

  /**
   * Override to initialize the newly added custom label.
   *
   * @param {Node} labelNode
   * @protected
   * @override
   */
  initCustomNode(labelNode) {
    this.__applyCustomLabel(labelNode);

    this.__observeLabel(labelNode);
  }

  /**
   * Override to cleanup label node when it's removed.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  teardownNode(node) {
    if (this.__labelObserver) {
      this.__labelObserver.disconnect();
    }

    // Default label is removed, do nothing.
    if (node !== this.defaultNode) {
      this.__applyDefaultLabel(this.label, this.defaultNode);
    }
  }

  /**
   * Set label based on corresponding host property.
   *
   * @param {string} label
   */
  setLabel(label) {
    this.label = label;

    if (this.defaultNode && this.node === this.defaultNode) {
      this.__applyDefaultLabel(label, this.defaultNode);
    }
  }

  /**
   * Set callback to be called when label changes.
   *
   * @param {Function} callback
   */
  setLabelChangedCallback(callback) {
    this.labelChangedCallback = callback;
  }

  /**
   * @param {HTMLElement} labelNode
   * @private
   */
  __applyCustomLabel(labelNode) {
    this.__updateLabelId(labelNode);
    const hasLabel = this.__hasLabel(labelNode);
    this.__toggleHasLabel(hasLabel);
  }

  /**
   * @param {HTMLElement} labelNode
   * @return {boolean}
   * @private
   */
  __hasLabel(labelNode) {
    if (!labelNode) {
      return false;
    }

    return labelNode.children.length > 0 || this.__isNotEmpty(labelNode.textContent);
  }

  /**
   * @param {string} label
   * @private
   */
  __isNotEmpty(label) {
    return Boolean(label && label.trim() !== '');
  }

  /**
   * @param {string} label
   * @param {HTMLElement} labelNode
   * @private
   */
  __applyDefaultLabel(label) {
    const { defaultId, defaultNode } = this;

    let currentLabel = this.getSlotChild();
    const hasSlottedLabel = this.__hasLabel(currentLabel);

    if (!currentLabel) {
      // Restore the default label element.
      currentLabel = defaultNode;
      currentLabel.id = defaultId;
      this.__observeLabel(currentLabel);
      this.host.appendChild(currentLabel);
    }

    const isDefaultLabel = currentLabel === this.defaultNode;

    // Only set text content for default label.
    if (isDefaultLabel) {
      currentLabel.textContent = label;
    }

    const hasLabel = isDefaultLabel ? this.__isNotEmpty(label) : hasSlottedLabel;
    this.__toggleHasLabel(hasLabel);
  }

  /**
   * @param {HTMLElement} labelNode
   * @private
   */
  __observeLabel(labelNode) {
    this.__labelObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target;

        // Ensure the mutation target is the currently connected label
        // to ignore async mutations dispatched for removed element.
        const isLabelMutation = target === this.node;

        if (mutation.type === 'attributes') {
          // We use attributeFilter to only observe ID mutation,
          // no need to check for attribute name separately.
          if (isLabelMutation && target.id !== this.defaultId) {
            this.__updateLabelId(target);
          }
        } else if (isLabelMutation || target.parentElement === this.node) {
          // Update has-label when textContent changes
          const hasLabel = this.__hasLabel(this.node);
          this.__toggleHasLabel(hasLabel);
        }
      });
    });

    // Observe changes to label ID attribute, text content and children.
    this.__labelObserver.observe(labelNode, {
      attributes: true,
      attributeFilter: ['id'],
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * @param {boolean} hasLabel
   * @private
   */
  __toggleHasLabel(hasLabel) {
    this.host.toggleAttribute('has-label', hasLabel);

    // Make it possible for other mixins to observe change
    if (typeof this.labelChangedCallback === 'function') {
      this.labelChangedCallback(hasLabel, this.node);
    }
  }

  /**
   * @param {HTMLElement} labelNode
   * @private
   */
  __updateLabelId(labelNode) {
    let newId;

    if (labelNode.id) {
      newId = labelNode.id;
    } else {
      newId = this.defaultId;
      labelNode.id = newId;
    }

    this.labelId = newId;
  }
}
