/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export declare function MenuBarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<KeyboardDirectionMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<MenuBarMixinClass> &
  Constructor<ResizeMixinClass> &
  T;

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
}
