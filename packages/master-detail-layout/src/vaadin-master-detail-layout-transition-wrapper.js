import { defineCustomElement } from '@vaadin/component-base/src/define.js';

class CustomNodeList {
  constructor(nodes = []) {
    this._nodes = Array.from(nodes);
    this.__updateIndices();
  }

  get length() {
    return this._nodes.length;
  }

  item(index) {
    if (index < 0 || index >= this._nodes.length) {
      return null;
    }
    return this._nodes[index];
  }

  forEach(callbackfn, thisArg) {
    this._nodes.forEach((node, index) => {
      callbackfn.call(thisArg, node, index, this);
    });
  }

  [Symbol.iterator]() {
    return this._nodes[Symbol.iterator]();
  }

  entries() {
    return this._nodes.entries();
  }

  keys() {
    return this._nodes.keys();
  }

  values() {
    return this._nodes.values();
  }

  push(node) {
    this._nodes.push(node);
    this.__updateIndices();
  }

  splice(start, deleteCount, ...nodes) {
    this._nodes.splice(start, deleteCount, ...nodes);
    this.__updateIndices();
  }

  __updateIndices() {
    for (let i = 0; i < this._nodes.length; i++) {
      this[i] = this._nodes[i];
    }

    for (let i = this._nodes.length; i in this; i++) {
      delete this[i];
    }
  }
}

/**
 * A wrapper element for displaying detail content in the master-detail layout.
 * Depending on whether the wrapper contains children or not, it will
 * automatically set a slot name to show or hide the detail area in the layout.
 * The wrapper will also automatically start a view transition when the
 * content changes. To support this, the wrapper updates its DOM asynchronously
 * so that it can batch multiple changes and then apply them once the
 * transition is ready. The wrapper only supports a limited set of DOM APIs,
 * which are intended to cover only those APIs used by Flow and React.
 */
class MasterDetailLayoutTransitionWrapper extends HTMLElement {
  static get is() {
    return 'vaadin-master-detail-layout-transition-wrapper';
  }

  constructor() {
    super();
    this.__childNodes = new CustomNodeList();
    this.__pendingUpdates = [];
    this.__initialized = false;
    this.style.display = 'contents';
  }

  connectedCallback() {
    this.__scheduleFlush();
    // Run all initial DOM updates synchronously, otherwise overlay detection in
    // the layout would only run after the next animation frame. Also don't
    // start view transitions for initial content.
    setTimeout(() => {
      this.__initialized = true;
    }, 500);
  }

  disconnectedCallback() {
    this.__initialized = false;
  }

  get childNodes() {
    return this.__childNodes;
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  appendChild(node) {
    const existingIndex = this.__findNodeIndex(node);
    if (existingIndex !== -1) {
      this.__childNodes.splice(existingIndex, 1);
    }
    this.__childNodes.push(node);

    this.__pendingUpdates.push(() => super.appendChild(node));
    this.__scheduleFlush();

    return node;
  }

  insertBefore(newNode, referenceNode) {
    const existingIndex = this.__findNodeIndex(newNode);
    if (existingIndex !== -1) {
      this.__childNodes.splice(existingIndex, 1);
    }

    const index = this.__findNodeIndex(referenceNode);
    if (index !== -1) {
      this.__childNodes.splice(index, 0, newNode);
    } else {
      this.__childNodes.push(newNode);
    }

    this.__pendingUpdates.push(() => super.insertBefore(newNode, referenceNode));
    this.__scheduleFlush();

    return newNode;
  }

  removeChild(node) {
    const index = this.__findNodeIndex(node);
    if (index === -1) {
      throw new Error('The node to be removed is not a child of this node');
    }

    this.__childNodes.splice(index, 1);
    this.__pendingUpdates.push(() => super.removeChild(node));
    this.__scheduleFlush();

    return node;
  }

  __findNodeIndex(node) {
    return Array.from(this.__childNodes).indexOf(node);
  }

  __updateSlotName() {
    const hasChildren = super.children.length > 0;

    if (hasChildren) {
      this.setAttribute('slot', 'detail');
    } else {
      this.setAttribute('slot', 'detail-hidden');
    }
  }

  __scheduleFlush() {
    if (!this.__initialized) {
      this.__flush();
      return;
    }
    if (this.__updateScheduled) {
      return;
    }
    this.__updateScheduled = true;
    requestAnimationFrame(() => this.__flush());
  }

  async __flush() {
    const layout = this.closest('vaadin-master-detail-layout');
    const updateDom = () => {
      for (const update of this.__pendingUpdates) {
        update();
      }
      this.__updateScheduled = false;
      this.__pendingUpdates = [];
      this.__childNodes = new CustomNodeList(super.childNodes);
      this.__updateSlotName();
    };

    if (!layout || layout.noAnimation || !this.__initialized || typeof document.startViewTransition !== 'function') {
      updateDom();
      return;
    }

    const hasOldChildren = Array.from(super.childNodes).some((child) => child.nodeType === Node.ELEMENT_NODE);
    const hasNewChildren = Array.from(this.childNodes).some((child) => child.nodeType === Node.ELEMENT_NODE);
    const transitionType = hasOldChildren && hasNewChildren ? 'replace' : hasNewChildren ? 'add' : 'remove';
    layout.setAttribute('transition', transitionType);
    const transition = document.startViewTransition(() => {
      updateDom();
    });
    await transition.finished;
    layout.removeAttribute('transition');
  }

  // Only used for testing purposes
  __getDomState() {
    return {
      childNodes: Array.from(super.childNodes),
      firstChild: super.firstChild,
      lastChild: super.lastChild,
    };
  }
}

defineCustomElement(MasterDetailLayoutTransitionWrapper);

export { MasterDetailLayoutTransitionWrapper };
