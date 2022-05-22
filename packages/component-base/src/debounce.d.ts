/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { AsyncInterface } from './async.js';

export declare class Debouncer {
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microTask} from '@vaadin/component-base/src/async.js';
   * import {Debouncer} from '@vaadin/component-base/src/debounce.js';
   * // ...
   *
   * _debounceWork() {
   *   this._debounceJob = Debouncer.debounce(this._debounceJob,
   *       microTask, () => this._doWork());
   * }
   * ```
   *
   * If the `_debounceWork` method is called multiple times within the same
   * microtask, the `_doWork` function will be called only once at the next
   * microtask checkpoint.
   *
   * Note: In testing it is often convenient to avoid asynchrony. To accomplish
   * this with a debouncer, you can use `enqueueDebouncer` and
   * `flush`. For example, extend the above example by adding
   * `enqueueDebouncer(this._debounceJob)` at the end of the
   * `_debounceWork` method. Then in a test, call `flush` to ensure
   * the debouncer has completed.
   *
   * @param debouncer Debouncer object.
   * @param asyncModule Object with Async interface
   * @param callback Callback to run.
   * @returns Returns a debouncer object.
   */
  static debounce(debouncer: Debouncer | null, asyncModule: AsyncInterface, callback: () => any): Debouncer;

  constructor();

  /**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param asyncModule Object with Async interface.
   * @param callback Callback to run.
   */
  setConfig(asyncModule: AsyncInterface, callback: () => any): void;

  /**
   * Cancels an active debouncer and returns a reference to itself.
   */
  cancel(): void;

  /**
   * Cancels a debouncer's async callback.
   */
  _cancelAsync(): void;

  /**
   * Flushes an active debouncer and returns a reference to itself.
   */
  flush(): void;

  /**
   * Returns true if the debouncer is active.
   *
   * @returns True if active.
   */
  isActive(): boolean;
}

/**
 * Adds a `Debouncer` to a list of globally flushable tasks.
 */
export declare function enqueueDebouncer(debouncer: Debouncer): void;

/**
 * Flushes any enqueued debouncers.
 *
 * @returns Returns whether any debouncers were flushed
 */
export declare function flushDebouncers(): boolean;

/**
 * Forces debouncers added via `enqueueDebouncer` to flush.
 *
 * @return {void}
 */
export declare function flush(): void;
