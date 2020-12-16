declare function InteractionsMixin<T extends new (...args: any[]) => {}>(base: T): T & InteractionsMixinConstructor;

interface InteractionsMixinConstructor {
  new (...args: any[]): InteractionsMixin;
}

interface InteractionsMixin {
  /**
   * If true, the submenu will open on hover (mouseover) instead of click.
   * @attr {boolean} open-on-hover
   */
  openOnHover: boolean | null | undefined;

  /**
   * Can be called to manually notify a resizable and its descendant
   * resizables of a resize change.
   */
  notifyResize(): void;

  _onFocusin(event: FocusEvent): void;

  _onKeydown(event: KeyboardEvent): void;

  _onMouseOver(e: MouseEvent): void;

  _close(restoreFocus: boolean): void;
}

export { InteractionsMixin, InteractionsMixinConstructor };
