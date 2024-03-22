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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { LitElement } from 'lit';

export declare function PolylitMixin<T extends Constructor<LitElement>>(base: T): Constructor<PolylitMixinClass> & T;

export declare class PolylitMixinClass {
  ready(): void;

  /**
   * Reads a value from a path.
   */
  protected _get(root: Object, path: String): any;

  /**
   * Sets a value to a path.
   */
  protected _set(root: Object, path: String, value: any): void;
}
