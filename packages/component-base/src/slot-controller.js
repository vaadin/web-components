/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

/**
 * A controller for providing content to slot element and observing changes.
 */
export class SlotController extends EventTarget {
  /**
   * Ensure that every instance has unique ID.
   *
   * @param {string} slotName
   * @param {HTMLElement} host
   * @return {string}
   * @protected
   */
  static generateId(slotName, host) {
    const prefix = slotName || 'default';

    // Support dash-case slot names e.g. "error-message"
    const field = `${dashToCamelCase(prefix)}Id`;

    // Maintain the unique ID counter for a given prefix.
    this[field] = 1 + this[field] || 0;

    return `${prefix}-${host.localName}-${this[field]}`;
  }

  constructor(host, slotName, slotFactory, slotInitializer) {
    super();

    this.host = host;
    this.slotName = slotName;
    this.slotFactory = slotFactory;
    this.slotInitializer = slotInitializer;
    this.defaultId = SlotController.generateId(slotName, host);
  }

  hostConnected() {
    if (!this.initialized) {
      let node = this.getSlotChild();

      if (!node) {
        node = this.attachDefaultNode();
      } else {
        this.node = node;
        this.initCustomNode(node);
      }

      this.initNode(node);

      // TODO: Consider making this behavior opt-in to improve performance.
      this.observe();

      this.initialized = true;
    }
  }

  /**
   * Create and attach default node using the slot factory.
   * @return {Node | undefined}
   * @protected
   */
  attachDefaultNode() {
    const { host, slotName, slotFactory } = this;

    // Check if the node was created previously and if so, reuse it.
    let node = this.defaultNode;

    // Slot factory is optional, some slots don't have default content.
    if (!node && slotFactory) {
      node = slotFactory(host);
      if (node instanceof Element) {
        if (slotName !== '') {
          node.setAttribute('slot', slotName);
        }
        this.node = node;
        this.defaultNode = node;
      }
    }

    if (node) {
      host.appendChild(node);
    }

    return node;
  }

  /**
   * Return a reference to the node managed by the controller.
   * @return {Node}
   */
  getSlotChild() {
    const { slotName } = this;
    return Array.from(this.host.childNodes).find((node) => {
      // Either an element (any slot) or a text node (only un-named slot).
      return (
        (node.nodeType === Node.ELEMENT_NODE && node.slot === slotName) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && slotName === '')
      );
    });
  }

  /**
   * @param {Node} node
   * @protected
   */
  initNode(node) {
    const { slotInitializer } = this;
    // Don't try to bind `this` to initializer (normally it's arrow function).
    // Instead, pass the host as a first argument to access component's state.
    if (slotInitializer) {
      slotInitializer(this.host, node);
    }
  }

  /**
   * Override to initialize the newly added custom node.
   *
   * @param {Node} _node
   * @protected
   */
  initCustomNode(_node) {}

  /**
   * Override to teardown slotted node when it's removed.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(_node) {}

  /**
   * Setup the observer to manage slot content changes.
   * @protected
   */
  observe() {
    const { slotName } = this;
    const selector = slotName === '' ? 'slot:not([name])' : `slot[name=${slotName}]`;
    const slot = this.host.shadowRoot.querySelector(selector);

    this.__slotObserver = new FlattenedNodesObserver(slot, (info) => {
      // TODO: support default slot with multiple nodes (e.g. confirm-dialog)
      const current = this.node;
      const newNode = info.addedNodes.find((node) => node !== current);

      if (info.removedNodes.length) {
        info.removedNodes.forEach((node) => {
          this.teardownNode(node);
        });
      }

      if (newNode) {
        // Custom node is added, remove the current one.
        if (current && current.isConnected) {
          this.host.removeChild(current);
        }

        this.node = newNode;

        if (newNode !== this.defaultNode) {
          this.initCustomNode(newNode);

          this.initNode(newNode);
        }
      }
    });
  }
}
