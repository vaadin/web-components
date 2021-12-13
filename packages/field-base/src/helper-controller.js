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
  constructor(host, helperId) {
    // Do not provide slot factory, as only create helper lazily.
    super(host, 'helper');
    this.__savedHelperId = helperId;
  }

  get helperId() {
    return this.host._helperId;
  }

  set helperId(helperId) {
    this.host._helperId = helperId;
  }

  hostConnected() {
    if (!this.initialized) {
      const helper = this.getSlotChild();
      if (helper) {
        this.__applyCustomHelper(helper);
      }
    }

    // Super call sets `initialized` to true.
    super.hostConnected();
  }

  /**
   * Override to initialize the newly added custom helper.
   *
   * @param {Node} helper
   * @protected
   * @override
   */
  initCustomNode(helper) {
    this.__applyCustomHelper(helper);

    this.__helperIdObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // only handle helper nodes
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'id' &&
          mutation.target === this.node &&
          mutation.target.id !== this.__savedHelperId
        ) {
          this.__updateHelperId(mutation.target);
        }
      });
    });

    this.__helperIdObserver.observe(helper, { attributes: true });
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
   * @param {HTMLElement} helper
   * @private
   */
  __applyCustomHelper(helper) {
    this.__updateHelperId(helper);
    this.__toggleHasHelper(helper.children.length > 0 || this.__isNotEmpty(helper.textContent));
  }

  /**
   * @param {string} helperText
   * @private
   */
  __isNotEmpty(helperText) {
    return helperText && helperText.trim() !== '';
  }

  /** @private */
  __attachDefaultHelper() {
    let helper = this.defaultNode;

    if (!helper) {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      this.defaultNode = helper;
    }

    helper.id = this.__savedHelperId;

    this.helperId = helper.id;
    this.host.appendChild(helper);

    // Init SlotController lazily.
    this.node = helper;
    this.observe(helper);

    return helper;
  }

  /**
   * @param {string} helperText
   * @private
   */
  __applyDefaultHelper(helperText) {
    let helper = this.getSlotChild();

    const hasHelperText = this.__isNotEmpty(helperText);
    if (hasHelperText && !helper) {
      // Create helper lazily
      helper = this.__attachDefaultHelper();
    }

    // Only set text content for default helper
    if (helper && helper === this.defaultNode) {
      helper.textContent = helperText;
    }

    this.__toggleHasHelper(hasHelperText);
  }

  /**
   * @param {boolean} hasHelper
   * @private
   */
  __toggleHasHelper(hasHelper) {
    this.host.toggleAttribute('has-helper', hasHelper);
  }

  /**
   * @param {HTMLElement} customHelper
   * @private
   */
  __updateHelperId(customHelper) {
    let newId;

    if (customHelper.id) {
      newId = customHelper.id;
    } else {
      newId = this.__savedHelperId;
      customHelper.id = newId;
    }

    this.helperId = newId;
  }
}
