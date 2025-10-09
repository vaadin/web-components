/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ResizeMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ResizeMixinClass> & T;

declare class ResizeMixinClass {}
