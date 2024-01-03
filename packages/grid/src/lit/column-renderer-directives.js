/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { CONTENT_UPDATE_DEBOUNCER } from './renderer-directives.js';

class AbstractGridColumnRendererDirective extends LitRendererDirective {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @abstract
   */
  get rendererProperty() {
    throw new Error('The `rendererProperty` getter must be implemented.');
  }

  /**
   * Adds the renderer callback to the grid column.
   */
  addRenderer() {
    this.element[this.rendererProperty] = (root, column) => {
      this.renderRenderer(root, column);
    };
  }

  /**
   * Runs the renderer callback on the grid column.
   */
  runRenderer() {
    const grid = this.element._grid;

    grid[CONTENT_UPDATE_DEBOUNCER] = Debouncer.debounce(grid[CONTENT_UPDATE_DEBOUNCER], microTask, () => {
      grid.requestContentUpdate();
    });
  }

  /**
   * Removes the renderer callback from the grid column.
   */
  removeRenderer() {
    this.element[this.rendererProperty] = null;
  }
}

export class GridColumnBodyRendererDirective extends AbstractGridColumnRendererDirective {
  get rendererProperty() {
    return 'renderer';
  }

  addRenderer() {
    this.element[this.rendererProperty] = (root, column, model) => {
      this.renderRenderer(root, model.item, model, column);
    };
  }
}

export class GridColumnHeaderRendererDirective extends AbstractGridColumnRendererDirective {
  get rendererProperty() {
    return 'headerRenderer';
  }
}

export class GridColumnFooterRendererDirective extends AbstractGridColumnRendererDirective {
  get rendererProperty() {
    return 'footerRenderer';
  }
}

/**
 * A Lit directive for rendering the content of the column's body cells.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid column
 * via the `renderer` property. The renderer is called for each column's body cell when assigned and whenever
 * a single dependency or an array of dependencies changes.
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
 * `<vaadin-grid-column
 *   ${columnBodyRenderer((item, model, column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const columnBodyRenderer = directive(GridColumnBodyRendererDirective);

/**
 * A Lit directive for rendering the content of the column's header cell.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid column
 * via the `headerRenderer` property. The renderer is called once when assigned and whenever
 * a single dependency or an array of dependencies changes.
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
 * `<vaadin-grid-column
 *   ${columnHeaderRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const columnHeaderRenderer = directive(GridColumnHeaderRendererDirective);

/**
 * A Lit directive for rendering the content of the column's footer cell.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the grid column
 * via the `footerRenderer` property. The renderer is called once when assigned and whenever
 * a single dependency or an array of dependencies changes.
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
 * `<vaadin-grid-column
 *   ${columnFooterRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const columnFooterRenderer = directive(GridColumnFooterRendererDirective);
