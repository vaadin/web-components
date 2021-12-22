/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller manage the helper node content.
 */
export class HelperController extends SlotController {
  constructor(host) {
    // Do not provide slot factory, as only create helper lazily.
    super(host, 'helper');
  }

  get helperId() {
    return this.node && this.node.id;
  }

  /** @protected */
  get uniqueId() {
    return SlotController.helperId;
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

    this.__applyDefaultHelper(this.helperText);
  }

  /**
   * Set helper text based on corresponding host property.
   * @param {string} helperText
   */
  setHelperText(helperText) {
    this.helperText = helperText;

    this.__applyDefaultHelper(helperText);
  }

  /**
   * @param {HTMLElement} helperNode
   * @private
   */
  __applyCustomHelper(helperNode) {
    this.__updateHelperId(helperNode);

    const hasHelper = this.__hasHelper(helperNode);
    this.__toggleHasHelper(hasHelper);
  }

  /**
   * @param {HTMLElement} helperNode
   * @return {boolean}
   * @private
   */
  __hasHelper(helperNode) {
    return Boolean(helperNode && (helperNode.children.length > 0 || this.__isNotEmpty(helperNode.textContent)));
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
   * @private
   */
  __applyDefaultHelper(helperText) {
    let helper = this.getSlotChild();

    const hasHelperText = this.__isNotEmpty(helperText);

    if (hasHelperText && !helper) {
      // Set slot factory lazily to only create helper node when needed.
      this.slotFactory = () => document.createElement('div');

      helper = this.attachDefaultNode();

      this.__updateHelperId(helper);
      this.__observeHelper(helper);
    }

    const isDefaultHelper = helper === this.defaultNode;

    // Only set text content for default helper
    if (helper && isDefaultHelper) {
      helper.textContent = helperText;
    }

    const hasHelper = isDefaultHelper ? hasHelperText : this.__hasHelper(helper);
    this.__toggleHasHelper(hasHelper);
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
