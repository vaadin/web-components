/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
}

export { InteractionsMixin, InteractionsMixinConstructor };
