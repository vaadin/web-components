/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { generateUniqueId } from './unique-id-utils.js';

/**
 * A controller for providing content to slot element and observing changes.
 *
 * The slot is filled with the custom nodes passed by the user, if any.
 * Otherwise, the controller creates a default node using the tag name.
 * In single mode, a newly slotted custom node replaces the current one.
 */
export class SlotController extends EventTarget {
  /**
   * Ensure that every instance has unique ID.
   *
   * @param {HTMLElement} host
   * @param {string} prefix
   * @return {string}
   * @protected
   */
  static generateId(host, prefix = 'default') {
    return `${prefix}-${host.localName}-${generateUniqueId()}`;
  }

  /** @type {Node | null} */
  node = null;

  /** @type {Node[]} */
  nodes = [];

  /** @type {WeakSet<Node>} */
  #initializedNodes = new WeakSet();

  constructor(host, slotName, tagName, config = {}) {
    super();

    const { initializer, multiple, observe, useUniqueId, uniqueIdPrefix } = config;

    this.host = host;
    this.slotName = slotName;
    this.tagName = tagName;
    this.observe = typeof observe === 'boolean' ? observe : true;
    this.multiple = typeof multiple === 'boolean' ? multiple : false;
    this.slotInitializer = initializer;

    // Only generate the default ID if requested by the controller.
    if (useUniqueId) {
      this.defaultId = this.constructor.generateId(host, uniqueIdPrefix || slotName);
    }
  }

  hostConnected() {
    if (!this.initialized) {
      this.initialized = true;

      if (this.observe) {
        const selector = this.slotName === '' ? 'slot:not([name])' : `slot[name=${this.slotName}]`;
        this.host.shadowRoot.querySelector(selector).addEventListener('slotchange', () => this.update());
      }

      this.update();
    }
  }

  /**
   * Return the list of nodes matching the slot managed by the controller.
   * @return {Node[]}
   */
  getSlotChildren() {
    const { slotName } = this;
    return Array.from(this.host.childNodes).filter((node) => {
      // Ignore nodes with data-slot-ignore attribute
      if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-slot-ignore')) {
        return false;
      }
      // Either an element (any slot) or a text node (only un-named slot).
      return (
        (node.nodeType === Node.ELEMENT_NODE && node.slot === slotName) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && slotName === '')
      );
    });
  }

  /**
   * Set up a node once it starts being managed by the controller,
   * either a default or a custom one. Runs `slotInitializer` by default,
   * only once for the default node.
   *
   * @param {Node} node
   * @protected
   */
  initNode(node) {
    const { slotInitializer } = this;
    if (!slotInitializer || (node === this.defaultNode && this.#initializedNodes.has(node))) {
      return;
    }

    this.#initializedNodes.add(node);
    // Don't try to bind `this` to initializer (normally it's arrow function).
    // Instead, pass the host as a first argument to access component's state.
    slotInitializer(node, this.host);
  }

  /**
   * Override to clean up a node once it is no longer managed by the controller.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(_node) {}

  /**
   * Update the managed nodes to match the slot children, and attach the
   * default node when there are no custom ones. Calls `teardownNode()`
   * for the nodes that left the slot and `initNode()` for the new ones.
   * Does nothing until the controller is connected to the host.
   *
   * @protected
   */
  update() {
    if (!this.initialized) {
      return;
    }

    const prevNodes = this.nodes;
    const nextNodes = [];

    const customNodes = this.#getCustomNodes();
    if (customNodes.length > 0) {
      this.defaultNode?.remove();

      nextNodes.push(...customNodes);
    } else {
      if (this.tagName && this.defaultNode?.parentNode !== this.host) {
        this.defaultNode ??= this.#createDefaultNode();
        this.host.appendChild(this.defaultNode);
      }

      if (this.defaultNode?.parentNode === this.host) {
        nextNodes.push(this.defaultNode);
      }
    }

    this.nodes = nextNodes;
    this.node = nextNodes[0] ?? null;

    prevNodes.filter((node) => !nextNodes.includes(node)).forEach((node) => this.teardownNode(node));
    nextNodes.filter((node) => !prevNodes.includes(node)).forEach((node) => this.initNode(node));
  }

  #getCustomNodes() {
    const nodes = this.getSlotChildren().filter((node) => node !== this.defaultNode);
    if (this.multiple || nodes.length <= 1) {
      return nodes;
    }

    // A newly slotted node replaces the current one.
    const node = nodes.findLast((n) => n !== this.node);
    nodes.filter((n) => n !== node).forEach((n) => n.remove());
    return [node];
  }

  #createDefaultNode() {
    const node = document.createElement(this.tagName);
    if (this.slotName !== '') {
      node.slot = this.slotName;
    }
    return node;
  }
}
