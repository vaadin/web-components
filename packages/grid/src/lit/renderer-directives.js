/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

export const CONTENT_UPDATE_DEBOUNCER = Symbol('contentUpdateDebouncer');

export class GridRowDetailsRendererDirective extends LitRendererDirective {
  /**
   * Adds the row details renderer callback to the grid.
   */
  addRenderer() {
    this.element.rowDetailsRenderer = (root, grid, model) => {
      this.renderRenderer(root, model.item, model, grid);
    };
  }

  /**
   * Runs the row details renderer callback on the grid.
   */
  runRenderer() {
    this.element[CONTENT_UPDATE_DEBOUNCER] = Debouncer.debounce(
      this.element[CONTENT_UPDATE_DEBOUNCER],
      microTask,
      () => {
        this.element.requestContentUpdate();
      },
    );
  }

  /**
   * Removes the row details renderer callback from the grid.
   */
  removeRenderer() {
    this.element.rowDetailsRenderer = null;
  }
}

/**
 * A Lit directive for populating the content of the row details cell.
 *
 * ```js
 * `<vaadin-grid
 *   ${gridRowDetailsRenderer((item, model, grid) => html`...`)}
 * ></vaadin-grid>`
 * ```
 */
export const gridRowDetailsRenderer = directive(GridRowDetailsRendererDirective);
