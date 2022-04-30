/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async';
import { Debouncer } from '@vaadin/component-base/src/debounce';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { CONTENT_UPDATE_DEBOUNCER } from './renderer-directives.js';

class AbstractGridColumnRendererDirective extends LitRendererDirective {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @abstract
   */
  rendererProperty;

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
  rendererProperty = 'renderer';

  addRenderer() {
    this.element[this.rendererProperty] = (root, column, model) => {
      this.renderRenderer(root, model.item, model, column);
    };
  }
}

export class GridColumnHeaderRendererDirective extends AbstractGridColumnRendererDirective {
  rendererProperty = 'headerRenderer';
}

export class GridColumnFooterRendererDirective extends AbstractGridColumnRendererDirective {
  rendererProperty = 'footerRenderer';
}

/**
 * A Lit directive for populating the content of the column's body cells.
 *
 * ```js
 * `<vaadin-grid-column
 *   ${columnBodyRenderer((item, model, column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 */
export const columnBodyRenderer = directive(GridColumnBodyRendererDirective);

/**
 * A Lit directive for populating the content of the column's header cell.
 *
 * ```js
 * `<vaadin-grid-column
 *   ${columnHeaderRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 */
export const columnHeaderRenderer = directive(GridColumnHeaderRendererDirective);

/**
 * A Lit directive for populating the content of the column's footer cell.
 *
 * ```js
 * `<vaadin-grid-column
 *   ${columnFooterRenderer((column) => html`...`)}
 * ></vaadin-grid-column>`
 * ```
 */
export const columnFooterRenderer = directive(GridColumnFooterRendererDirective);
