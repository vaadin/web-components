import { CSSResult } from 'lit-element';

export { css, unsafeCSS } from 'lit-element';

/**
 * Registers CSS styles for a component type. Make sure to register the styles before
 * the first instance of a component of the type is attached to DOM.
 */
declare function registerStyles(
  themeFor: String | null,
  styles: CSSResult | Array<CSSResult | null> | null,
  options?: object | null
): void;

export { registerStyles };
