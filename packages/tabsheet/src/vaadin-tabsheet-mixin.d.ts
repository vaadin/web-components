/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';

/**
 * A mixin providing common tab-sheet functionality.
 */
export declare function TabSheetMixin<
  Tab extends HTMLElement,
  T extends Constructor<HTMLElement> = Constructor<HTMLElement>,
>(base: T): Constructor<DelegateStateMixinClass> & Constructor<TabSheetMixinClass<Tab>> & T;

export declare class TabSheetMixinClass<Tab extends HTMLElement> {
  /**
   * The index of the selected tab.
   */
  selected: number | null | undefined;

  /**
   * The list of `<vaadin-tab>`s from which a selection can be made.
   * It is populated from the elements passed inside the slotted
   * `<vaadin-tabs>`, and updated dynamically when adding or removing items.
   *
   * Note: unlike `<vaadin-combo-box>`, this property is read-only.
   */
  readonly items: Tab[] | undefined;
}
