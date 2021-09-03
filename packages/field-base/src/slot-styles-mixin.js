import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const stylesMap = new WeakMap();

/**
 * Get all the styles inserted into root.
 * @param {DocumentOrShadowRoot} root
 * @return {Array<string>}
 */
function getRootStyles(root) {
  if (!stylesMap.has(root)) {
    stylesMap.set(root, []);
  }

  return stylesMap.get(root);
}

/**
 * Detect if styles have been already inserted to root.
 * @param {string} styles
 * @param {DocumentOrShadowRoot} root
 * @return {boolean}
 */
function hasStyles(styles, root) {
  return getRootStyles(root).includes(styles);
}

/**
 * Insert styles into the root.
 * @param {string} css
 * @param {DocumentOrShadowRoot} root
 */
function insertStyles(styles, root) {
  if (!styles || (styles && hasStyles(styles, root))) {
    return;
  }

  const rootNode = root === document ? document.head : root;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(styles));
  rootNode.appendChild(style);
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
        let styles = '';

        Object.keys(this.slotStyles).forEach((styleName) => {
          styles += this.slotStyles[styleName];
        });

        this.__slotStyles = styles;
      }

      return this.__slotStyles;
    }

    /** @private */
    __applySlotStyles() {
      const styles = this.__gatherSlotStyles();

      insertStyles(styles, this.getRootNode());
    }
  };

/**
 * Mixin to insert styles into the outer scope to handle slotted components.
 * This is useful e.g. to hide native `<input type="number">` controls.
 */
export const SlotStylesMixin = dedupingMixin(SlotStylesMixinImplementation);
