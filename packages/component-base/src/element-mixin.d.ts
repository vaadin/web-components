/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ReactiveControllerHost } from 'lit';
import '../custom_typings/vaadin-usage-statistics.js';
import '../custom_typings/vaadin.js';
import { DirMixin, DirMixinConstructor } from './dir-mixin.js';

declare function ElementMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ElementMixinConstructor & DirMixinConstructor;

interface ElementMixinConstructor {
  new (...args: any[]): ElementMixin;
  finalize(): void;
}

interface ElementMixin extends Pick<ReactiveControllerHost, 'addController' | 'removeController'>, DirMixin {}

export { ElementMixin, ElementMixinConstructor };
