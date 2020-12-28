import { GridItem } from './interfaces';

declare function ActiveItemMixin<T extends new (...args: any[]) => {}>(base: T): T & ActiveItemMixinConstructor;

interface ActiveItemMixinConstructor {
  new (...args: any[]): ActiveItemMixin;
}

interface ActiveItemMixin {
  /**
   * The item user has last interacted with. Turns to `null` after user deactivates
   * the item by re-interacting with the currently active item.
   */
  activeItem: GridItem | null;

  /**
   * We need to listen to click instead of tap because on mobile safari, the
   * document.activeElement has not been updated (focus has not been shifted)
   * yet at the point when tap event is being executed.
   */
  _onClick(e: MouseEvent): void;

  _isFocusable(target: Element): boolean;
}

declare function isFocusable(target: Element): boolean;

export { ActiveItemMixin, ActiveItemMixinConstructor, isFocusable };
