/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common details functionality.
 */
export declare function DetailsMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<DetailsMixinClass> & T;

export declare class DetailsMixinClass {
  /**
   * If true, the collapsible content is visible.
   */
  opened: boolean;

  /**
   * List of elements passed to the details default slot.
   */
  protected _contentElements: HTMLElement[];

  /**
   * An element used to toggle the content visibility.
   */
  protected _toggleElement: HTMLElement;
}
