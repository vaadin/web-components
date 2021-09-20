import { CSSResultGroup } from 'lit';
import { ThemePropertyMixin, ThemePropertyMixinConstructor } from './vaadin-theme-property-mixin.js';

declare function ThemableMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ThemableMixinConstructor & ThemePropertyMixinConstructor;

interface ThemableMixinConstructor {
  new (...args: any[]): ThemableMixin;
  finalize(): void;
}

interface ThemableMixin extends ThemePropertyMixin {}

/**
 * Registers CSS styles for a component type. Make sure to register the styles before
 * the first instance of a component of the type is attached to DOM.
 */
declare function registerStyles(themeFor: string | null, styles: CSSResultGroup, options?: object | null): void;

export { css, unsafeCSS } from 'lit';

export { ThemableMixin, ThemableMixinConstructor, registerStyles };
