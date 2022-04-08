/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

export declare function PolylitMixin<T extends Constructor<LitElement>>(base: T): T & Constructor<PolylitMixinClass>;

export declare class PolylitMixinClass {
  ready(): void;
}
