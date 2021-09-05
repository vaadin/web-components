import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const stylesMap = new WeakMap();

/**
 * Get all the styles inserted into root.
 * @param {DocumentOrShadowRoot} root
 * @return {Array<string>}
 */
function getRootStyles(root) {
  if (!stylesMap.has(root)) {
    stylesMap.set(root, {});
  }

  return stylesMap.get(root);
}

/**
 * Insert styles into the root.
 * @param {string} styles
 * @param {DocumentOrShadowRoot} root
 */
function insertStyles(styles, root) {
  const style = document.createElement('style');
  style.textContent = styles;

  if (root === document) {
    document.head.appendChild(style);
  } else {
    root.insertBefore(style, root.firstChild);
  }
}

const SlotStylesMixinImplementation = (superclass) =>
  class SlotStylesMixinClass extends superclass {
    /**
     * List of styles to insert into root.
     * @protected
     */
    get slotStyles() {
      return {};
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this.__applySlotStyles();
    }

    /** @private */
    __gatherSlotStyles() {
      if (!this.__slotStyles) {
        this.__slotStyles = Object.entries(this.slotStyles);
      }

      return this.__slotStyles;
    }

    /** @private */
    __applySlotStyles() {
      const root = this.getRootNode();
      const rootStyles = getRootStyles(root);
      const slotStyles = this.__gatherSlotStyles();

      slotStyles.forEach(([id, styles]) => {
        if (!rootStyles[id]) {
          insertStyles(styles, root);
          rootStyles[id] = styles;
        }
      });
    }
  };

/**
 * Mixin to insert styles into the outer scope to handle slotted components.
 * This is useful e.g. to hide native `<input type="number">` controls.
 */
export const SlotStylesMixin = dedupingMixin(SlotStylesMixinImplementation);
