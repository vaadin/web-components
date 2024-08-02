/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DirectiveResult } from 'lit/directive.js';
import { LitRendererDirective, type LitRendererResult } from '@vaadin/lit-renderer';
import type { Popover } from '../vaadin-popover.js';

export type PopoverLitRenderer = (popover: Popover) => LitRendererResult;

export class PopoverRendererDirective extends LitRendererDirective<Popover, PopoverLitRenderer> {
  /**
   * Adds the renderer callback to the popover.
   */
  addRenderer(): void;

  /**
   * Runs the renderer callback on the popover.
   */
  runRenderer(): void;

  /**
   * Removes the renderer callback from the popover.
   */
  removeRenderer(): void;
}

/**
 * A Lit directive for populating the content of the `<vaadin-popover-overlay>` element.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the popover
 * via the `renderer` property. The renderer is called once to populate the content when assigned
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
 * `<vaadin-popover
 *   ${popoverRenderer((popover) => html`...`)}
 * ></vaadin-popover>`
 * ```
 *
 * @param renderer the renderer callback that returns a Lit template.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export declare function popoverRenderer(
  renderer: PopoverLitRenderer,
  dependencies?: unknown,
): DirectiveResult<typeof PopoverRendererDirective>;
