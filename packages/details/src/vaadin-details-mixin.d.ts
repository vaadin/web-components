/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/component-base/src/delegate-focus-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { CollapsibleMixinClass } from './collapsible-mixin.js';

/**
 * A mixin providing common details functionality.
 */
export declare function DetailsMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<CollapsibleMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DetailsMixinClass> &
  T;

export declare class DetailsMixinClass {
  /**
   * A text that is displayed in the summary, if no
   * element is assigned to the `summary` slot.
   */
  summary: string | null | undefined;
}
