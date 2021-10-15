/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { usageStatistics } from '@vaadin/vaadin-usage-statistics/vaadin-usage-statistics.js';
import { idlePeriod } from './async.js';
import { Debouncer, enqueueDebouncer } from './debounce.js';
import { DirMixin } from './dir-mixin.js';

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
    static get version() {
      return '22.0.0-alpha10';
    }

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

      this.__controllers = new Set();

      if (document.doctype === null) {
        console.warn(
          'Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'
        );
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this.__controllers.forEach((c) => {
        c.hostConnected && c.hostConnected();
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.__controllers.forEach((c) => {
        c.hostDisconnected && c.hostDisconnected();
      });
    }

    /**
     * Registers a controller to participate in the element update cycle.
     * @protected
     */
    addController(controller) {
      this.__controllers.add(controller);
      // Call hostConnected if a controller is added after the element is attached.
      if (this.$ !== undefined && this.isConnected && controller.hostConnected) {
        controller.hostConnected();
      }
    }

    /**
     * Removes a controller from the element.
     * @protected
     */
    removeController(controller) {
      this.__controllers.delete(controller);
    }
  };
