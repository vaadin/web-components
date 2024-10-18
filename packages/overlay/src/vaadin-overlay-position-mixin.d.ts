/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PopoverPositionMixinClass } from '@vaadin/popover/src/vaadin-popover-position-mixin.js';
import type { OverlayPositionManager } from './vaadin-overlay-position-manager.js';

export declare function PositionMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PositionMixinClass> & Constructor<PopoverPositionMixinClass> & T;

export declare class PositionMixinClass {
  protected _manager: OverlayPositionManager;
}
