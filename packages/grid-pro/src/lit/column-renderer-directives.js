/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { CONTENT_UPDATE_DEBOUNCER } from '@vaadin/grid/src/lit/renderer-directives.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

export class GridProColumnEditModeRendererDirective extends LitRendererDirective {
  /**
   * Adds the renderer callback to the grid edit column.
   */
  addRenderer() {
    this.element.editModeRenderer = (root, column, model) => {
      this.renderRenderer(root, model.item, model, column);
    };
  }

  /**
   * Runs the renderer callback on the grid edit column.
   */
  runRenderer() {
    const grid = this.element._grid;

    grid[CONTENT_UPDATE_DEBOUNCER] = Debouncer.debounce(grid[CONTENT_UPDATE_DEBOUNCER], microTask, () => {
      grid.requestContentUpdate();
    });
  }

  /**
   * Removes the renderer callback from the grid edit column.
   */
  removeRenderer() {
    this.element.editModeRenderer = null;
  }
}

/**
 * A Lit directive for rendering the content of column's body cells when they are in edit mode.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid edit column
 * via the `editModeRenderer` property. The renderer is called when a column's body cell switches to edit mode
 * and whenever a single dependency or an array of dependencies changes as long as edit mode is on.
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
 * `<vaadin-grid-pro-edit-column
 *   ${columnEditModeRenderer((item, model, column) => html`...`)}
 * ></vaadin-grid-pro-edit-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const columnEditModeRenderer = directive(GridProColumnEditModeRendererDirective);
