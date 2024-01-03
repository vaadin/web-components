/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ListMixinClass } from '@vaadin/a11y-base/src/list-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export type TabsOrientation = 'horizontal' | 'vertical';

export declare function TabsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<KeyboardDirectionMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<ListMixinClass> &
  Constructor<ResizeMixinClass> &
  Constructor<TabsMixinClass> &
  T;

export declare class TabsMixinClass {
  /**
   * The index of the selected tab.
   */
  selected: number | null | undefined;

  /**
   * Set tabs disposition. Possible values are `horizontal|vertical`
   */
  orientation: TabsOrientation;
}
