/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { nothing, RenderOptions, TemplateResult } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { PartInfo } from 'lit/directive.js';

export type LitRenderer = (...args: any[]) => TemplateResult;

export abstract class LitRendererDirective<E extends Element, R extends LitRenderer> extends AsyncDirective {
  constructor(info: PartInfo);

  protected host: RenderOptions['host'];

  protected element: E;

  protected renderer: R;

  protected renderRenderer(container: Element, ...args: Parameters<R>): void;

  render(_renderer: R, _value?: unknown): typeof nothing;

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
}
