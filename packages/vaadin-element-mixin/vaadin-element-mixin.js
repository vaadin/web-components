/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { idlePeriod } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer, enqueueDebouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { usageStatistics } from '@vaadin/vaadin-usage-statistics/vaadin-usage-statistics.js';
import { DirMixin } from './vaadin-dir-mixin.js';

window.Vaadin = window.Vaadin || {};

/**
 * Array of Vaadin custom element classes that have been finalized.
 */
window.Vaadin.registrations = window.Vaadin.registrations || [];

window.Vaadin.developmentModeCallback = window.Vaadin.developmentModeCallback || {};

window.Vaadin.developmentModeCallback['vaadin-usage-statistics'] = function () {
  usageStatistics();
};

let statsJob;

const registered = new Set();

/**
 * @polymerMixin
 * @mixes DirMixin
 */
export const ElementMixin = (superClass) =>
  class VaadinElementMixin extends DirMixin(superClass) {
    /** @protected */
    static finalize() {
      super.finalize();

      const { is } = this;

      // Registers a class prototype for telemetry purposes.
      if (is && !registered.has(is)) {
        window.Vaadin.registrations.push(this);
        registered.add(is);

        if (window.Vaadin.developmentModeCallback) {
          statsJob = Debouncer.debounce(statsJob, idlePeriod, () => {
            window.Vaadin.developmentModeCallback['vaadin-usage-statistics']();
          });
          enqueueDebouncer(statsJob);
        }
      }
    }

    constructor() {
      super();
      if (document.doctype === null) {
        console.warn(
          'Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'
        );
      }
    }
  };
