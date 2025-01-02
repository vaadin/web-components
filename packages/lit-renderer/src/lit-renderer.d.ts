/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ElementPart, noChange, nothing, RenderOptions, TemplateResult } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';

// Opinionated union of types allowed to be returned from Lit renderers.
// Theoretically Lit allows to render pretty much everything, but in practice
// these seem the mose useful ones, without allowing developers to return things
// like objects or dates that probably don't render the way they expect.
export type LitRendererResult = TemplateResult | string | typeof noChange | typeof nothing | null;

export type LitRenderer = (...args: any[]) => LitRendererResult;

export abstract class LitRendererDirective<E extends Element, R extends LitRenderer> extends AsyncDirective {
  protected host: RenderOptions['host'];

  protected element: E;

  protected renderer: R;

  render(_renderer: R, _value?: unknown): typeof nothing;

  update(_part: ElementPart, props: [R, unknown]): typeof nothing;

  /**
   * Adds the renderer callback to the element.
   */
  abstract addRenderer(): void;

  /**
   * Runs the renderer callback on the element.
   */
  abstract runRenderer(): void;

  /**
   * Removes the renderer callback from the element.
   */
  abstract removeRenderer(): void;

  protected renderRenderer(container: Element, ...args: Parameters<R>): void;
}
