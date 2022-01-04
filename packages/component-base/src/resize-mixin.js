/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const observer = new ResizeObserver((entries) => {
  setTimeout(() => {
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
export const ResizeMixin = dedupingMixin(
  (superclass) =>
    class ResizeMixinClass extends superclass {
      /** @protected */
      connectedCallback() {
        super.connectedCallback();
        observer.observe(this);
      }

      /** @protected */
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
