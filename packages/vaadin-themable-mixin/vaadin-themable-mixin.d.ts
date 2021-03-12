import { ThemePropertyMixin, ThemePropertyMixinConstructor } from './vaadin-theme-property-mixin.js';

declare function ThemableMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ThemableMixinConstructor & ThemePropertyMixinConstructor;

interface ThemableMixinConstructor {
  new (...args: any[]): ThemableMixin;
  finalize(): void;
}

interface ThemableMixin extends ThemePropertyMixin {}

export { ThemableMixin, ThemableMixinConstructor };
