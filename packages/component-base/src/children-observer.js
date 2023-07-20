/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from './async.js';

export class ChildrenObserver {
  constructor(target, callback) {
    /**
     * @type {!HTMLElement}
     * @private
     */
    this._target = target;

    /**
     * @type {MutationObserver}
     * @private
     */
    this._nativeObserver = null;

    /**
     * @type {Function}
     * @private
     */
    this._callback = callback;

    this._scheduled = false;

    this.connect();

    this._schedule();
  }

  /**
   * Activates an observer. This method is automatically called when
   * a `ChildrenObserver` is created. It should only be called to re-activate
   * an observer that has been deactivated via the `disconnect` method.
   */
  connect() {
    this._nativeObserver = new MutationObserver((mutations) => {
      this._processMutations(mutations);
    });
    this._nativeObserver.observe(this._target, { childList: true });
    this._connected = true;
  }

  /**
   * Deactivates the mutation observer. After calling this method
   * the observer callback will not be called when changes to children
   * occur. The `connect` method may be subsequently called to reactivate
   * the observer.
   */
  disconnect() {
    this._nativeObserver.disconnect();
    this._nativeObserver = null;
    this._connected = false;
  }

  /**
   * Flushes the observer causing any pending changes to be immediately
   * delivered the observer callback. By default these changes are delivered
   * asynchronously at the next microtask checkpoint.
   */
  flush() {
    if (!this._nativeObserver) {
      return;
    }

    const mutations = this._nativeObserver.takeRecords();
    this._processMutations(mutations);
  }

  /** @private */
  _schedule() {
    if (!this._scheduled) {
      this._scheduled = true;
      microTask.run(() => this.flush());
    }
  }

  /** @private */
  _processMutations(mutations) {
    const info = { addedNodes: [], removedNodes: [] };

    mutations.forEach((record) => {
      info.addedNodes = [...info.addedNodes, ...record.addedNodes];
      info.removedNodes = [...info.removedNodes, ...record.removedNodes];
    });

    if (info.addedNodes.length || info.removedNodes.length) {
      this._callback(info);
    }
  }
}
