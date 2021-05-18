import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { IconSvgLiteral } from './vaadin-icon-svg.js';

/**
 * `<vaadin-iconset>` is a Web Component for creating SVG icon collections.
 */
declare class IconsetElement extends ElementMixin(HTMLElement) {
  /**
   * Create an instance of the iconset.
   */
  static getIconset(name: string): IconsetElement;

  /**
   * The name of the iconset.
   */
  name: string;

  /**
   * Produce SVGTemplateResult for the element matching `id` in this
   * iconset, or `undefined` if there is no matching element.
   */
  applyIcon(name: string): IconSvgLiteral;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-iconset': IconsetElement;
  }
}

export { IconsetElement };
