/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

let debounce;

const observer = new ResizeObserver((entries) => {
  debounce = Debouncer.debounce(debounce, timeOut.after(0), () => {
    entries.forEach((entry) => {
      entry.target._onResize(entry.contentRect);
    });
  });
});

/**
 * A mixin that uses a ResizeObserver to listen to host size changes.
 *
 * @polymerMixin
 */
export const ResizableMixin = dedupingMixin(
  (superclass) =>
    class ResizableMixinClass extends superclass {
      connectedCallback() {
        super.connectedCallback();
        observer.observe(this);
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        observer.unobserve(this);
      }

      /**
       * A handler invoked on host resize. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @protected
       */
      _onResize(_contentRect) {
        // To be implemented.
      }

      /**
       * @deprecated Since Vaadin 23, `notifyResize()` is deprecated. The component uses a
       * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
       */
      notifyResize() {
        console.warn(
          `WARNING: Since Vaadin 23, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.`
        );
      }
    }
);
