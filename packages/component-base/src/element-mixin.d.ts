/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '../custom_typings/vaadin-usage-statistics.js';
import '../custom_typings/vaadin.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DirMixinClass } from './dir-mixin.js';

/**
 * A mixin providing common logic for Vaadin components.
 */
export declare function ElementMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<DirMixinClass> & Constructor<ElementMixinClass> & T;

export declare class ElementMixinClass {
  static version: string;

  protected static finalize(): void;
}
