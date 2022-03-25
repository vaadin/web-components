import { nothing, RenderOptions, TemplateResult } from 'lit';
import { Directive, ElementPart, PartInfo, PartType } from 'lit/directive.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LitRenderer = (...args: any[]) => TemplateResult;

// A sentinel that indicates renderer hasn't been initialized
const initialValue = {};

export abstract class LitRendererDirective<T extends Element, R extends LitRenderer> extends Directive {
  previousValue: unknown = initialValue;

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) {
      throw new Error('renderer only supports binding to element');
    }
  }

  render(_renderer: R, _value?: unknown): typeof nothing {
    return nothing;
  }

  update(part: ElementPart, [renderer, value]: [R, unknown]): unknown {
    const firstRender = this.previousValue === initialValue;

    if (!this.hasChanged(value)) {
      return nothing;
    }

    // Copy the value if it's an array so that if it's mutated we don't forget
    // what the previous values were.
    this.previousValue = Array.isArray(value) ? Array.from(value) : value;

    const element = part.element as T;

    // TODO: support re-assigning renderer function.
    if (firstRender) {
      const host = part.options?.host;
      this.addRenderer(element, renderer, { host });
    } else {
      this.runRenderer(element);
    }

    return nothing;
  }

  hasChanged(value: unknown): boolean {
    let result = true;

    if (Array.isArray(value)) {
      // Dirty-check arrays by item
      if (
        Array.isArray(this.previousValue) &&
        this.previousValue.length === value.length &&
        value.every((v, i) => v === (this.previousValue as Array<unknown>)[i])
      ) {
        result = false;
      }
    } else if (this.previousValue === value) {
      // Dirty-check non-arrays by identity
      result = false;
    }
    return result;
  }

  /**
   * Set renderer callback to the element.
   */
  abstract addRenderer(element: T, renderer: R, options: RenderOptions): void;

  /**
   * Run renderer callback on the element.
   */
  abstract runRenderer(element: T): void;
}
