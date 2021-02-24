/**
 * `Polymer.IronFocusablesHelper` relies on some Polymer-specific legacy API,
 * especially the `root` property which does not exist for native shadow DOM.
 * That's why we have this helper here.
 * See https://github.com/PolymerElements/iron-overlay-behavior/issues/282
 */
declare class FocusablesHelper {
  /**
   * Returns a sorted array of tabbable nodes, including the root node.
   * It searches the tabbable nodes in the light and shadow dom of the children,
   * sorting the result by tabindex.
   */
  static getTabbableNodes(node: Node): HTMLElement[];

  /**
   * Returns if a element is focusable.
   */
  static isFocusable(element: HTMLElement): boolean;

  /**
   * Returns if a element is tabbable. To be tabbable, a element must be
   * focusable, visible, and with a tabindex !== -1.
   */
  static isTabbable(element: HTMLElement): boolean;
}

export { FocusablesHelper };
