/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
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
        this.__updateDefaultLabel(this.label);

        this.__observeLabel(node);
      },
    );
  }

  /**
   * @return {string}
   */
  get labelId() {
    return this.node.id;
  }

  /**
   * Override to initialize the newly added custom label.
   *
   * @param {Node} labelNode
   * @protected
   * @override
   */
  initCustomNode(labelNode) {
    this.__updateLabelId(labelNode);

    const hasLabel = this.__hasLabel(labelNode);
    this.__toggleHasLabel(hasLabel);
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

    let labelNode = this.getSlotChild();

    // If custom label was removed, restore the default one.
    if (!labelNode && node !== this.defaultNode) {
      labelNode = this.attachDefaultNode();

      // Run initializer to update default label and ID.
      this.initNode(labelNode);
    }

    const hasLabel = this.__hasLabel(labelNode);
    this.__toggleHasLabel(hasLabel);
  }

  /**
   * Set label based on corresponding host property.
   *
   * @param {string} label
   */
  setLabel(label) {
    this.label = label;

    this.__updateDefaultLabel(label);
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
      characterData: true,
    });
  }

  /**
   * @param {boolean} hasLabel
   * @private
   */
  __toggleHasLabel(hasLabel) {
    this.host.toggleAttribute('has-label', hasLabel);

    // Make it possible for other mixins to observe change
    this.dispatchEvent(
      new CustomEvent('label-changed', {
        detail: {
          hasLabel,
          node: this.node,
        },
      }),
    );
  }

  /**
   * @param {string} label
   * @private
   */
  __updateDefaultLabel(label) {
    if (this.defaultNode) {
      this.defaultNode.textContent = label;

      // Update has-label if default label is used
      if (this.defaultNode === this.node) {
        const hasLabel = this.__isNotEmpty(label);
        this.__toggleHasLabel(hasLabel);
      }
    }
  }

  /**
   * @param {HTMLElement} labelNode
   * @private
   */
  __updateLabelId(labelNode) {
    if (!labelNode.id) {
      labelNode.id = this.defaultId;
    }
  }
}
