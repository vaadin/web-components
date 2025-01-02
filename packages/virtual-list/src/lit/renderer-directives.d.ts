/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DirectiveResult } from 'lit/directive.js';
import type { LitRendererResult } from '@vaadin/lit-renderer';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import type { VirtualList, VirtualListItemModel } from '../vaadin-virtual-list.js';

export type VirtualListLitRenderer<TItem> = (
  item: TItem,
  model: VirtualListItemModel<TItem>,
  virtualList: VirtualList<TItem>,
) => LitRendererResult;

export class VirtualListRendererDirective<TItem> extends LitRendererDirective<
  VirtualList,
  VirtualListLitRenderer<TItem>
> {
  /**
   * Adds the renderer callback to the virtual list.
   */
  addRenderer(): void;

  /**
   * Runs the renderer callback on the virtual list.
   */
  runRenderer(): void;

  /**
   * Removes the renderer callback from the virtual list.
   */
  removeRenderer(): void;
}

/**
 * A Lit directive for rendering the content of the `<vaadin-virtual-list>` item elements.
 *
 * The directive accepts a renderer callback returning a Lit template and assigns it to the virtual
 * list via the `renderer` property. The renderer is called once to populate the content when
 * assigned and whenever a single dependency or an array of dependencies changes.
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
 * `<vaadin-virtual-list
 *   ${virtualListRenderer((item, model, virtualList) => html`...`)}
 * ></vaadin-virtual-list>`
 * ```
 *
 * @param renderer the renderer callback that returns a Lit template.
 * @param dependencies a single dependency or an array of dependencies
 *                     which trigger a re-render when changed.
 */
export declare function virtualListRenderer<TItem>(
  renderer: VirtualListLitRenderer<TItem>,
  dependencies?: unknown,
): DirectiveResult<typeof VirtualListRendererDirective>;
