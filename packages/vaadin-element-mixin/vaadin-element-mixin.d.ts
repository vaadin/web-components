import 'custom_typings/vaadin-usage-statistics.js';
import 'custom_typings/vaadin.js';

import { DirMixin, DirMixinConstructor } from './vaadin-dir-mixin.js';

declare function ElementMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ElementMixinConstructor & DirMixinConstructor;

interface ElementMixinConstructor {
  new (...args: any[]): ElementMixin;
  finalize(): void;
}

interface ElementMixin extends DirMixin {}

export { ElementMixin, ElementMixinConstructor };
