declare function ActiveItemMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & ActiveItemMixinConstructor<TItem>;

interface ActiveItemMixinConstructor<TItem> {
  new (...args: any[]): ActiveItemMixin<TItem>;
}

interface ActiveItemMixin<TItem> {
  /**
   * The item user has last interacted with. Turns to `null` after user deactivates
   * the item by re-interacting with the currently active item.
   */
  activeItem: TItem | null;
}

declare function isFocusable(target: Element): boolean;

export { ActiveItemMixin, ActiveItemMixinConstructor, isFocusable };
