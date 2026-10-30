/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { hasNodeContent, isEmptyTextNode } from './dom-utils.js';
import { generateUniqueId } from './unique-id-utils.js';

/**
 * A controller that manages the content of a slot: the custom nodes slotted
 * by the user, or a default node created by the controller when there are none.
 * Subclasses override the hooks to create the default node and to set up,
 * update and tear down the content nodes. The host calls `update()` when
 * a property used by the hooks changes, and listens for `content-changed`.
 *
 * In single mode, a newly slotted custom node replaces the current one.
 * With the `multiple` option, all the custom nodes are kept as content.
 */
export class SlotContentController extends EventTarget {
  /**
   * Generate an ID unique per host instance.
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
   * The default node created by `createDefaultNode()`, also when not in the DOM.
   * @type {Node | null}
   */
  defaultNode = null;

  /**
   * The ID generated from `idPrefix` for content that has no ID of its own.
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
   * Update the content to match the slot children and the host state, running
   * the hooks for the nodes that changed and `updateNode()` for all of them,
   * then dispatch `content-changed`. Does nothing before `hostConnected()`.
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
   * Override to create the default node. Return `null` for no default content.
   *
   * @return {Node | null}
   * @protected
   */
  createDefaultNode() {
    return null;
  }

  /**
   * Override to control whether the default node is in the DOM, e.g. only
   * while the host property it shows is not empty.
   *
   * @return {boolean}
   * @protected
   */
  shouldShowDefault() {
    return true;
  }

  /**
   * Override to set up a node once it becomes content, e.g. to add listeners.
   *
   * @param {Node} _node
   * @protected
   */
  initNode(_node) {}

  /**
   * Override to apply the host state to a content node. Runs after `initNode()`
   * and on every `update()`, for default and custom nodes alike.
   *
   * @param {Node} _node
   * @protected
   */
  updateNode(_node) {}

  /**
   * Override to clean up a node once it stops being content.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(_node) {}

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

    if (!this.defaultNode) {
      const node = this.createDefaultNode();
      if (!node) {
        return [];
      }
      if (node instanceof Element && this.slotName !== '') {
        node.setAttribute('slot', this.slotName);
      }
      this.defaultNode = node;
    }

    if (this.defaultNode.parentNode !== this.host) {
      this.host.appendChild(this.defaultNode);
    }
    return [this.defaultNode];
  }

  #getCustomNodes() {
    const nodes = [...this.host.childNodes].filter((node) => this.#isCustomNode(node));
    if (this.multiple || nodes.length <= 1) {
      return nodes;
    }

    // In single mode, the newest custom node replaces the current one.
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
