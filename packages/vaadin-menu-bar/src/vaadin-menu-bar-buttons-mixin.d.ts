import { SlotMixin } from '@vaadin/field-base/src/slot-mixin.js';
import { MenuBarI18n } from './interfaces';

declare function ButtonsMixin<T extends new (...args: any[]) => {}>(base: T): T & ButtonsMixinConstructor;

interface ButtonsMixinConstructor {
  new (...args: any[]): ButtonsMixin;
}

interface ButtonsMixin extends SlotMixin {
  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * To update individual properties, extend the existing i18n object like so:
   * ```
   * menuBar.i18n = {
   *   ...menuBar.i18n,
   *   moreOptions: 'More options'
   * }
   * ```
   *
   * The object has the following JSON structure and default values:
   * ```
   * {
   *   moreOptions: 'More options'
   * }
   * ```
   */
  i18n: MenuBarI18n;

  readonly _buttons: HTMLElement[];

  readonly _container: HTMLElement;

  readonly _overflow: HTMLElement;

  _hasOverflow: boolean;

  /**
   * Call this method after updating menu bar `items` dynamically, including changing
   * any property on the item object corresponding to one of the menu bar buttons.
   */
  render(): void;
}

export { ButtonsMixin, ButtonsMixinConstructor };
