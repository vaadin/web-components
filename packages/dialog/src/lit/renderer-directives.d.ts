/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/* eslint-disable max-classes-per-file */
import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import type { Dialog } from '../vaadin-dialog.js';

export type DialogLitRenderer = (dialog: Dialog) => TemplateResult;

declare abstract class AbstractDialogRendererDirective extends LitRendererDirective<Dialog, DialogLitRenderer> {
  /**
   * A property to that the renderer callback will be assigned.
   */
  abstract rendererProperty: 'footerRenderer' | 'headerRenderer' | 'renderer';

  /**
   * Adds the renderer callback to the dialog.
   */
  addRenderer(): void;

  /**
   * Runs the renderer callback on the dialog.
   */
  runRenderer(): void;

  /**
   * Removes the renderer callback from the dialog.
   */
  removeRenderer(): void;
}

export class DialogRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty: 'renderer';
}

export class DialogHeaderRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty: 'headerRenderer';
}

export class DialogFooterRendererDirective extends AbstractDialogRendererDirective {
  rendererProperty: 'footerRenderer';
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
export declare function dialogRenderer(
  renderer: DialogLitRenderer,
  dependencies?: unknown,
): DirectiveResult<typeof DialogRendererDirective>;

/**
 * A Lit directive for populating the content of the dialog header.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the dialog
 * via the `headerRenderer` property. The renderer is called to populate the content once
 * when assigned and whenever a single dependency or an array of dependencies changes.
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
export declare function dialogHeaderRenderer(
  renderer: DialogLitRenderer,
  dependencies?: unknown,
): DirectiveResult<typeof DialogHeaderRendererDirective>;

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
export declare function dialogFooterRenderer(
  renderer: DialogLitRenderer,
  dependencies?: unknown,
): DirectiveResult<typeof DialogFooterRendererDirective>;
