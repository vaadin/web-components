/**
 * Polymer.IronControlState is not a proper 2.0 class, also, its tabindex
 * implementation fails in the shadow dom, so we have this for vaadin elements.
 */
declare function ShadowFocusMixin<T extends new (...args: any[]) => {}>(base: T): T & ShadowFocusMixinConstructor;

interface ShadowFocusMixinConstructor {
  new (...args: any[]): ShadowFocusMixin;
}

interface ShadowFocusMixin {
  /**
   * Any element extending this mixin is required to implement this getter.
   * It returns the actual focusable element in the component.
   */
  readonly focusElement: Element | null | undefined;

  /**
   * Specify that this control should have input focus when the page loads.
   */
  autofocus: boolean | null | undefined;

  /**
   * If true, the user cannot interact with this element.
   */
  disabled: boolean | null | undefined;

  _setFocused(focused: boolean): void;

  _focus(): void;

  click(): void;
}

export { ShadowFocusMixinConstructor, ShadowFocusMixin };
