/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { directive } from 'lit/directive.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

export class ComboBoxRendererDirective extends LitRendererDirective {
  /**
   * Adds the renderer callback to the combo-box.
   */
  addRenderer() {
    this.element.renderer = (root, comboBox, model) => {
      this.renderRenderer(root, model.item, model, comboBox);
    };
  }

  /**
   * Runs the renderer callback on the combo-box.
   */
  runRenderer() {
    this.element.requestContentUpdate();
  }

  /**
   * Removes the renderer callback from the combo-box.
   */
  removeRenderer() {
    this.element.renderer = null;
  }
}

/**
 * A Lit directive for rendering the content of the `<vaadin-combo-box-item>` elements.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the combo-box
 * via the `renderer` property. The renderer is called for each combo-box item when assigned
 * and whenever a single dependency or an array of dependencies changes.
 * It is not guaranteed that the renderer will be called immediately (synchronously) in both cases.
 *
 * Dependencies can be a single value or an array of values.
 * Values are checked against previous values with strict equality (`===`),
 * so the check won't detect nested property changes inside objects or arrays.
 * When dependencies are provided as an array, each item is checked against the previous value
 * at the same index with strict equality. Nested arrays are also checked only by strict
 * equality.
 *
 * Example of usage:
 * ```js
 * `<vaadin-combo-box
 *   ${comboBoxRenderer((item, model, comboBox) => html`...`)}
 * ></vaadin-combo-box>`
 * ```
 *
 * @param renderer the renderer callback that returns a Lit template.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const comboBoxRenderer = directive(ComboBoxRendererDirective);
