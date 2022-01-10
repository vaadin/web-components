/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the helper node content.
 */
export class HelperController extends SlotController {
  constructor(host) {
    // Do not provide slot factory, as only create helper lazily.
    super(host, 'helper');
  }

  get helperId() {
    return this.node && this.node.id;
  }

  /**
   * Override to initialize the newly added custom helper.
   *
   * @param {Node} helperNode
   * @protected
   * @override
   */
  initCustomNode(helperNode) {
    this.__updateHelperId(helperNode);

    this.__observeHelper(helperNode);

    const hasHelper = this.__hasHelper(helperNode);
    this.__toggleHasHelper(hasHelper);
  }

  /**
   * Override to cleanup helper node when it's removed.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    // The observer does not exist when the default helper is removed.
    if (this.__helperIdObserver) {
      this.__helperIdObserver.disconnect();
    }

    const helperNode = this.getSlotChild();

    // Custom node is added to helper slot
    if (helperNode && helperNode !== this.defaultNode) {
      const hasHelper = this.__hasHelper(helperNode);
      this.__toggleHasHelper(hasHelper);
    } else {
      // Restore default helper if needed
      this.__applyDefaultHelper(this.helperText, helperNode);
    }
  }

  /**
   * Set helper text based on corresponding host property.
   * @param {string} helperText
   */
  setHelperText(helperText) {
    this.helperText = helperText;

    const helperNode = this.getSlotChild();
    if (!helperNode || helperNode === this.defaultNode) {
      this.__applyDefaultHelper(helperText, helperNode);
    }
  }

  /**
   * @param {HTMLElement} helperNode
   * @return {boolean}
   * @private
   */
  __hasHelper(helperNode) {
    if (!helperNode) {
      return false;
    }

    return helperNode.children.length > 0 || this.__isNotEmpty(helperNode.textContent);
  }

  /**
   * @param {string} helperText
   * @private
   */
  __isNotEmpty(helperText) {
    return helperText && helperText.trim() !== '';
  }

  /**
   * @param {string} helperText
   * @param {Node} helperNode
   * @private
   */
  __applyDefaultHelper(helperText, helperNode) {
    const hasHelperText = this.__isNotEmpty(helperText);

    if (hasHelperText && !helperNode) {
      // Set slot factory lazily to only create helper node when needed.
      this.slotFactory = () => document.createElement('div');

      helperNode = this.attachDefaultNode();

      this.__updateHelperId(helperNode);
      this.__observeHelper(helperNode);
    }

    if (helperNode) {
      helperNode.textContent = helperText;
    }

    this.__toggleHasHelper(hasHelperText);
  }

  /**
   * @param {HTMLElement} helperNode
   * @private
   */
  __observeHelper(helperNode) {
    this.__helperObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target;

        // Ensure the mutation target is the currently connected helper
        // to ignore async mutations dispatched for removed element.
        const isHelperMutation = target === this.node;

        if (mutation.type === 'attributes') {
          // We use attributeFilter to only observe ID mutation,
          // no need to check for attribute name separately.
          if (isHelperMutation && target.id !== this.defaultId) {
            this.__updateHelperId(target);
          }
        } else if (isHelperMutation || target.parentElement === this.node) {
          // Update has-helper when textContent changes
          const hasHelper = this.__hasHelper(this.node);
          this.__toggleHasHelper(hasHelper);
        }
      });
    });

    // Observe changes to helper ID attribute, text content and children.
    this.__helperObserver.observe(helperNode, {
      attributes: true,
      attributeFilter: ['id'],
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * @param {boolean} hasHelper
   * @private
   */
  __toggleHasHelper(hasHelper) {
    this.host.toggleAttribute('has-helper', hasHelper);

    // Make it possible for other mixins to observe change
    this.dispatchEvent(
      new CustomEvent('helper-changed', {
        detail: {
          hasHelper,
          node: this.node
        }
      })
    );
  }

  /**
   * @param {HTMLElement} helperNode
   * @private
   */
  __updateHelperId(helperNode) {
    if (!helperNode.id) {
      helperNode.id = this.defaultId;
    }
  }
}
