/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing, render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { PartType } from 'lit/directive.js';

// A symbol indicating that the directive hasn't been initialized.
const VALUE_NOT_INITIALIZED = Symbol('valueNotInitialized');

export class LitRendererDirective extends AsyncDirective {
  constructor(part) {
    super(part);

    if (part.type !== PartType.ELEMENT) {
      throw new Error(`\`${this.constructor.name}\` must be bound to an element.`);
    }

    this.previousValue = VALUE_NOT_INITIALIZED;
  }

  /** @override */
  render(_renderer, _value) {
    return nothing;
  }

  /** @override */
  update(part, [renderer, value]) {
    if (!this.hasChanged(value)) {
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

  /** @override */
  reconnected() {
    this.addRenderer();
  }

  /** @override */
  disconnected() {
    this.removeRenderer();
  }

  /** @abstract */
  addRenderer() {
    throw new Error('The `addRenderer` method must be implemented.');
  }

  /** @abstract */
  runRenderer() {
    throw new Error('The `runRenderer` method must be implemented.');
  }

  /** @abstract */
  removeRenderer() {
    throw new Error('The `removeRenderer` method must be implemented.');
  }

  /** @protected */
  renderRenderer(container, ...args) {
    // Note that a renderer result is not necessarily a `TemplateResult`
    // instance, as Lit allows returning any value from a renderer. The concrete
    // list of types we allow as render results is defined in the Typescript
    // `LitRendererResult` type.
    const templateResult = this.renderer.call(this.host, ...args);
    render(templateResult, container, { host: this.host });
  }

  /** @protected */
  hasChanged(value) {
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
