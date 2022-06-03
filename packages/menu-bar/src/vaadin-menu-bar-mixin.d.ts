/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export declare function ButtonsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<MenuBarMixinClass> & Constructor<KeyboardMixinClass> & Constructor<ResizeMixinClass>;

export declare class MenuBarMixinClass {
  /**
   * If true, the submenu will open on hover (mouseover) instead of click.
   * @attr {boolean} open-on-hover
   */
  openOnHover: boolean | null | undefined;

  protected readonly _buttons: HTMLElement[];

  protected readonly _container: HTMLElement;

  protected readonly _overflow: HTMLElement;

  protected _hasOverflow: boolean;

  /**
   * @deprecated Since Vaadin 23, `notifyResize()` is deprecated. The component uses a
   * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
   */
  notifyResize(): void;
}
