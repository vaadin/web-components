/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common badge functionality.
 *
 * @polymerMixin
 * @mixes ElementMixin
 */
const BadgeMixinImplementation = (superClass) =>
  class BadgeMixinClass extends superClass {
    /**
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      // Observe slot for empty state
      this.__observeSlot();
    }

    /**
     * Sets up slot observation to detect empty state
     * @private
     */
    __observeSlot() {
      const slot = this.shadowRoot.querySelector('slot:not([name])');
      if (slot) {
        slot.addEventListener('slotchange', () => this.__updateEmptyState());
        this.__updateEmptyState();
      }
    }

    /**
     * Updates the 'empty' attribute based on slot content
     * @private
     */
    __updateEmptyState() {
      const slot = this.shadowRoot.querySelector('slot:not([name])');
      const nodes = slot.assignedNodes({ flatten: true });
      const hasContent = nodes.some((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return node.nodeType === Node.ELEMENT_NODE;
      });

      this.toggleAttribute('empty', !hasContent);
    }
  };

export const BadgeMixin = dedupeMixin(BadgeMixinImplementation);
