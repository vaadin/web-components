/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { RenderOptions } from 'lit';
import { Directive } from 'lit/directive.js';

export abstract class LitRendererDirective<E extends Element, R extends LitRenderer> extends Directive {
  /**
   * Adds a renderer callback to the element.
   */
  abstract addRenderer(element: E, renderer: R, options: RenderOptions): void;

  /**
   * Runs the renderer callback on the element.
   */
  abstract runRenderer(element: E): void;
}
