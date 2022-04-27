import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { PartType } from 'lit/directive.js';

/**
 * @typedef {import('lit/directive.js').PartInfo} PartInfo
 * @typedef {import('lit/directive.js').ElementPart} ElementPart
 */

// A symbol that indicates that the renderer hasn't been initialized.
const VALUE_NOT_INITIALIZED = Symbol('valueNotInitialized');

export class LitRendererDirective extends AsyncDirective {
  /**
   * @type {unknown}
   */
  previousValue = VALUE_NOT_INITIALIZED;

  /**
   * @param {PartInfo} part
   */
  constructor(part) {
    super(part);
    if (part.type !== PartType.ELEMENT) {
      // TODO: Improve the error message by mentioning the actual name of the renderer directive.
      throw new Error('Renderer can be only bound to an element.');
    }
  }

  /**
   * @param {ElementPart} part
   * @param {[R, unknown]}
   * @return {unknown}
   */
  update(part, [renderer, value]) {
    const firstRender = this.previousValue === VALUE_NOT_INITIALIZED;

    if (!this.__hasChanged(value)) {
      return nothing;
    }

    this.host = part.options?.host;
    this.element = part.element;
    this.renderer = renderer;

    // Copy the value if it's an array so that if it's mutated we don't forget
    // what the previous values were.
    this.previousValue = Array.isArray(value) ? Array.from(value) : value;

    if (firstRender) {
      this.addRenderer();
    } else {
      this.runRenderer();
    }

    return nothing;
  }

  disconnected() {
    this.disposeOfRenderer();
    this.host = null;
    this.element = null;
    this.renderer = null;
  }

  addRenderer() {
    throw new Error('The `addRenderer` method must be implemented.');
  }

  runRenderer() {
    throw new Error('The `runRenderer` method must be implemented.');
  }

  disposeOfRenderer() {
    throw new Error('The `disposeOfRenderer` method must be implemented.');
  }

  /**
   * @param {unknown} value
   * @return {boolean}
   */
  __hasChanged(value) {
    if (Array.isArray(value)) {
      if (!Array.isArray(this.previousValue)) {
        return true;
      }

      if (this.previousValue.length !== value.length) {
        return true;
      }

      // For arrays, perform shallow dirty checking for each element.
      return value.some((v, i) => v !== this.previousValue[i]);
    }

    return this.previousValue !== value;
  }
}
