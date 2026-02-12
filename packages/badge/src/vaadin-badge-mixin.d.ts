/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common badge functionality.
 */
export declare function BadgeMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<BadgeMixinClass> & T;

export declare class BadgeMixinClass {}
