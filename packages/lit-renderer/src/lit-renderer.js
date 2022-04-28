/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing, render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { PartType } from 'lit/directive.js';

// A symbol indicating that the directive hasn't been initialized.
const VALUE_NOT_INITIALIZED = Symbol('valueNotInitialized');

export class LitRendererDirective extends AsyncDirective {
  previousValue = VALUE_NOT_INITIALIZED;

  constructor(part) {
    super(part);
    if (part.type !== PartType.ELEMENT) {
      // TODO: Improve the error message by mentioning the actual name of the renderer directive.
      throw new Error('Renderer can be only bound to an element.');
    }
  }

  update(part, [renderer, value]) {
    if (!this.__hasChanged(value)) {
      return nothing;
    }

    this.host = part.options && part.options.host;
    this.element = part.element;
    this.renderer = renderer;

    const firstRender = this.previousValue === VALUE_NOT_INITIALIZED;
    if (firstRender) {
      this.addRenderer();
    } else {
      this.runRenderer();
    }

    // Copy the value if it is an array in order to keep it
    // from possible outside mutations.
    this.previousValue = Array.isArray(value) ? [...value] : value;

    return nothing;
  }

  reconnected() {
    this.addRenderer();
  }

  disconnected() {
    this.removeRenderer();
  }

  addRenderer() {
    throw new Error('The `addRenderer` method must be implemented.');
  }

  runRenderer() {
    throw new Error('The `runRenderer` method must be implemented.');
  }

  removeRenderer() {
    throw new Error('The `removeRenderer` method must be implemented.');
  }

  renderRenderer(container, ...args) {
    const templateResult = this.renderer.call(this.host, ...args);
    render(templateResult, container, { host: this.host });
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
