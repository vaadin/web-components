/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';

declare type Constructor<T> = new (...args: any[]) => T;

declare function PolylitMixin<T extends Constructor<LitElement>>(base: T): T & PolylitMixinConstructor;

interface PolylitMixinConstructor {
  new (...args: any[]): PolylitMixin;
}

interface PolylitMixin {
  ready(): void;
}

export { PolylitMixin, PolylitMixinConstructor };
