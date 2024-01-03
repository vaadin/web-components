/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { CollapsibleMixinClass } from '@vaadin/details/src/collapsible-mixin.js';

/**
 * A mixin providing common accordion panel functionality.
 */
export declare function AccordionPanelMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<AccordionPanelMixinClass> &
  Constructor<CollapsibleMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<TabindexMixinClass> &
  T;

export declare class AccordionPanelMixinClass {
  /**
   * A text that is displayed in the heading, if no
   * element is assigned to the `summary` slot.
   */
  summary: string | null | undefined;
}
