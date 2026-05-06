/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { usageStatistics } from '@vaadin/vaadin-usage-statistics/vaadin-usage-statistics.js';
import { idlePeriod } from './async.js';
import { Debouncer, enqueueDebouncer } from './debounce.js';
import { DirMixin } from './dir-mixin.js';

/**
 * @typedef {import('lit').LitElement & import('./polylit-mixin.js').PolylitMixinClass} VaadinElement
 */

const win =
  /** @type {Window & { Vaadin: { registrations: unknown[]; developmentModeCallback: Record<string, () => void> } }} */ (
    /** @type {unknown} */ (window)
  );

if (!win.Vaadin) {
  win.Vaadin = /** @type {typeof win.Vaadin} */ ({});
}

/**
 * Array of Vaadin custom element classes that have been finalized.
 */
if (!win.Vaadin.registrations) {
  win.Vaadin.registrations = [];
}

if (!win.Vaadin.developmentModeCallback) {
  win.Vaadin.developmentModeCallback = {};
}

win.Vaadin.developmentModeCallback['vaadin-usage-statistics'] = function () {
  usageStatistics();
};

/** @type {import('./debounce.js').Debouncer | null} */
let statsJob = null;

/** @type {Set<string>} */
const registered = new Set();

/**
 * @polymerMixin
 * @mixes DirMixin
 * @template {new (...args: any[]) => VaadinElement} T
 * @param {T} superClass
 */
export const ElementMixin = (superClass) =>
  class VaadinElementMixin extends DirMixin(superClass) {
    /** @protected */
    static _ensureRegistrations() {
      const { is } = /** @type {{ is?: string }} */ (/** @type {unknown} */ (this));

      // Registers a class prototype for telemetry purposes.
      if (is && !registered.has(is)) {
        win.Vaadin.registrations.push(this);
        registered.add(is);

        const callback = win.Vaadin.developmentModeCallback;
        if (callback) {
          statsJob = Debouncer.debounce(statsJob, idlePeriod, () => {
            callback['vaadin-usage-statistics']();
          });
          enqueueDebouncer(statsJob);
        }
      }
    }

    constructor() {
      super();

      if (document.doctype === null) {
        console.warn(
          'Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.',
        );
      }

      /** @type {typeof VaadinElementMixin} */ (this.constructor)._ensureRegistrations();
    }
  };
