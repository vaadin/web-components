/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import { directive } from 'lit/directive.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';

const CONTENT_UPDATE_DEBOUNCER = Symbol('contentUpdateDebouncer');

class AbstractDialogRendererDirective extends LitRendererDirective {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @abstract
   */
  get rendererProperty() {
    throw new Error('The `rendererProperty` getter must be implemented.');
  }

  /**
   * Adds the renderer callback to the dialog.
   */
  addRenderer() {
    this.element[this.rendererProperty] = (root, dialog) => {
      this.renderRenderer(root, dialog);
    };
  }

  /**
   * Runs the renderer callback on the dialog.
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
   * Removes the renderer callback from the dialog.
   */
  removeRenderer() {
    this.element[this.rendererProperty] = null;
    delete this.element[CONTENT_UPDATE_DEBOUNCER];
  }
}

export class DialogRendererDirective extends AbstractDialogRendererDirective {
  get rendererProperty() {
    return 'renderer';
  }
}

export class DialogHeaderRendererDirective extends AbstractDialogRendererDirective {
  get rendererProperty() {
    return 'headerRenderer';
  }
}

export class DialogFooterRendererDirective extends AbstractDialogRendererDirective {
  get rendererProperty() {
    return 'footerRenderer';
  }
}

/**
 * A Lit directive for populating the content of the dialog.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the dialog
 * via the `renderer` property. The renderer is called to populate the content once when assigned
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
 * `<vaadin-dialog
 *   ${dialogRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 *
 * @param renderer the renderer callback that returns a Lit template.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const dialogRenderer = directive(DialogRendererDirective);

/**
 * A Lit directive for populating the content of the dialog header.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the dialog
 * via the `headerRenderer` property. The renderer is called to populate the content once when assigned
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
 * `<vaadin-dialog
 *   ${dialogHeaderRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const dialogHeaderRenderer = directive(DialogHeaderRendererDirective);

/**
 * A Lit directive for populating the content of the dialog footer.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the dialog
 * via the `footerRenderer` property. The renderer is called to populate the content once when assigned
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
 * `<vaadin-dialog
 *   ${dialogFooterRenderer((dialog) => html`...`)}
 * ></vaadin-dialog>`
 * ```
 *
 * @param renderer the renderer callback.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export const dialogFooterRenderer = directive(DialogFooterRendererDirective);
