import { CSSResultGroup } from 'lit';

export { css, unsafeCSS } from 'lit';

/**
 * Registers CSS styles for a component type. Make sure to register the styles before
 * the first instance of a component of the type is attached to DOM.
 */
declare function registerStyles(themeFor: string | null, styles: CSSResultGroup, options?: object | null): void;

export { registerStyles };
