import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { SVGTemplateResult } from 'lit-html';

/**
 * `<vaadin-icon>` is a Web Component for creating SVG icons.
 */
declare class IconElement extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   * The name of the icon to use. The name should be of the form:
   * `iconset_name:icon_name`.
   */
  icon: string | null;

  /**
   * The SVG icon wrapped in a Lit template literal.
   */
  svg: SVGTemplateResult | null;

  /**
   * The size of an icon, used to set the `viewBox` attribute.
   */
  size: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-icon': IconElement;
  }
}

export { IconElement };
