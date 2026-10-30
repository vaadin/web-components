/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { hasNodeContent, isEmptyTextNode } from './dom-utils.js';
import { generateUniqueId } from './unique-id-utils.js';

/**
 * A controller that manages the content of a slot: either the custom nodes
 * slotted by the user, or a default node that the controller creates when
 * nothing custom is slotted. Custom content always wins over the default.
 *
 * Subclasses customize the behavior by overriding the hooks:
 *
 * - `createDefault()` returns the default node, or `null` for no default content.
 * - `shouldShowDefault()` tells whether the default node belongs in the DOM.
 * - `initNode(node)` runs once when a node becomes content, default or custom.
 * - `updateNode(node)` runs after `initNode()` and on every `update()`.
 * - `teardownNode(node)` runs once when a node stops being content.
 *
 * The host calls `update()` when a property used by the hooks changes,
 * and listens for the `content-changed` event to react to the content.
 *
 * In single mode, a newly slotted custom node replaces the current one.
 * With the `multiple` option, all the custom nodes are kept as content.
 */
export class SlotContentController extends EventTarget {
  /**
   * Generate an ID that is unique per host instance.
   *
   * @param {HTMLElement} host
   * @param {string} prefix
   * @return {string}
   */
  static generateId(host, prefix) {
    return `${prefix}-${host.localName}-${generateUniqueId()}`;
  }

  /**
   * The current content node, or the first one in `multiple` mode.
   * @type {Node | null}
   */
  node = null;

  /**
   * The current content nodes.
   * @type {Node[]}
   */
  nodes = [];

  /**
   * The default node created by `createDefault()`, whether or not it is in the DOM.
   * @type {Node | null}
   */
  defaultNode = null;

  /**
   * The ID assigned to the content that has none, when `idPrefix` is set.
   * @type {string | undefined}
   */
  defaultId;

  #initialized = false;

  #hasContent = false;

  #observer = new MutationObserver((records) => this.#onMutation(records));

  /**
   * @param {HTMLElement} host
   * @param {string} slotName
   * @param {{ multiple?: boolean, idPrefix?: string, observeContent?: boolean }} config
   */
  constructor(host, slotName, { multiple = false, idPrefix, observeContent = false } = {}) {
    super();

    this.host = host;
    this.slotName = slotName;
    this.multiple = multiple;
    this.observeContent = observeContent;

    if (idPrefix) {
      this.defaultId = this.constructor.generateId(host, idPrefix);
    }
  }

  /**
   * Whether the content has any text or elements.
   * @return {boolean}
   */
  get hasContent() {
    return this.nodes.some((node) => hasNodeContent(node));
  }

  hostConnected() {
    if (this.#initialized) {
      return;
    }
    this.#initialized = true;

    const selector = this.slotName === '' ? 'slot:not([name])' : `slot[name="${this.slotName}"]`;
    this.host.shadowRoot.querySelector(selector).addEventListener('slotchange', () => this.update());

    this.update();
  }

  /**
   * Update the content to match the slot children and the host state.
   * Attaches the default node when there is no custom content, calls
   * `teardownNode()` for the nodes that stopped being content, `initNode()`
   * for the new ones and `updateNode()` for all of them, then dispatches
   * the `content-changed` event. Does nothing until the controller is
   * connected to the host.
   */
  update() {
    if (!this.#initialized) {
      return;
    }

    const prevNodes = this.nodes;
    const nextNodes = this.#collectNodes();
    this.nodes = nextNodes;
    this.node = nextNodes[0] ?? null;

    const removedNodes = prevNodes.filter((node) => !nextNodes.includes(node));
    const addedNodes = nextNodes.filter((node) => !prevNodes.includes(node));

    removedNodes.forEach((node) => this.teardownNode(node));
    nextNodes.forEach((node) => this.#assignId(node));
    addedNodes.forEach((node) => this.initNode(node));
    nextNodes.forEach((node) => this.updateNode(node));

    if (removedNodes.length > 0 || addedNodes.length > 0) {
      this.#observeNodes();
    } else {
      // Drop the records queued by the hooks changing the nodes above,
      // so that the observer does not report the controller's own changes.
      this.#observer.takeRecords();
    }

    this.#notifyChange();
  }

  /**
   * Override to create the default node, used as content when nothing
   * custom is slotted. Return `null` when the slot has no default content.
   *
   * @return {Node | null}
   * @protected
   */
  createDefault() {
    return null;
  }

  /**
   * Override to tell whether the default node belongs in the DOM. Only asked
   * when nothing custom is slotted. Return `false` to create the default node
   * lazily, or to remove it, e.g. while the host property it shows is empty.
   *
   * @return {boolean}
   * @protected
   */
  shouldShowDefault() {
    return true;
  }

  /**
   * Override to set up a node once it becomes content, default or custom,
   * e.g. to add event listeners. Runs after the generated ID is assigned.
   *
   * @param {Node} _node
   * @protected
   */
  initNode(_node) {}

  /**
   * Override to make a content node reflect the host state. Runs after
   * `initNode()` and on every `update()`, for default and custom nodes alike.
   *
   * @param {Node} _node
   * @protected
   */
  updateNode(_node) {}

  /**
   * Override to clean up a node once it stops being content, e.g. to remove
   * the event listeners added in `initNode()`.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(_node) {}

  /**
   * Return the content nodes, attaching or detaching the default node as needed.
   * @return {Node[]}
   */
  #collectNodes() {
    const customNodes = this.#getCustomNodes();
    if (customNodes.length > 0) {
      this.#detachDefaultNode();
      return customNodes;
    }

    if (!this.shouldShowDefault()) {
      this.#detachDefaultNode();
      return [];
    }

    this.defaultNode ??= this.#createDefaultNode();
    if (!this.defaultNode) {
      return [];
    }

    if (this.defaultNode.parentNode !== this.host) {
      this.host.appendChild(this.defaultNode);
    }
    return [this.defaultNode];
  }

  /**
   * Return the custom nodes slotted by the user. In single mode, the newest
   * one replaces the current one, and the others are removed from the DOM.
   * @return {Node[]}
   */
  #getCustomNodes() {
    const nodes = [...this.host.childNodes].filter((node) => this.#isCustomNode(node));
    if (this.multiple || nodes.length <= 1) {
      return nodes;
    }

    const node = nodes.findLast((n) => n !== this.node);
    nodes.filter((n) => n !== node).forEach((n) => n.remove());
    return [node];
  }

  #isCustomNode(node) {
    if (node === this.defaultNode) {
      return false;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return node.slot === this.slotName && !node.hasAttribute('data-slot-ignore');
    }

    // Text nodes only count as content of the default slot.
    return node.nodeType === Node.TEXT_NODE && this.slotName === '' && !isEmptyTextNode(node);
  }

  #createDefaultNode() {
    const node = this.createDefault();
    if (node instanceof Element && this.slotName !== '') {
      node.setAttribute('slot', this.slotName);
    }
    return node;
  }

  #detachDefaultNode() {
    if (this.defaultNode?.parentNode === this.host) {
      this.defaultNode.remove();
    }
  }

  #assignId(node) {
    if (!this.defaultId || node.nodeType !== Node.ELEMENT_NODE || node.id) {
      return;
    }

    // In multiple mode, only the first node gets the generated ID.
    if (this.multiple && node !== this.nodes[0]) {
      return;
    }

    node.id = this.defaultId;
  }

  #observeNodes() {
    this.#observer.disconnect();

    const options = {};
    if (this.defaultId) {
      options.attributeFilter = ['id'];
    }
    if (this.observeContent) {
      Object.assign(options, { childList: true, subtree: true, characterData: true });
    }

    if (Object.keys(options).length > 0) {
      this.nodes.forEach((node) => this.#observer.observe(node, options));
    }
  }

  #onMutation(records) {
    if (records.some((record) => record.type === 'attributes')) {
      // Restore the generated ID if it was removed, and drop the record queued by that.
      this.nodes.forEach((node) => this.#assignId(node));
      this.#observer.takeRecords();

      this.#notifyChange();
    } else if (this.hasContent !== this.#hasContent) {
      this.#notifyChange();
    }
  }

  #notifyChange() {
    const { node, nodes, hasContent } = this;
    this.#hasContent = hasContent;

    this.dispatchEvent(
      new CustomEvent('content-changed', {
        detail: { node, nodes, hasContent, isDefault: node !== null && node === this.defaultNode },
      }),
    );
  }
}
