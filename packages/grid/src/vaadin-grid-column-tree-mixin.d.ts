/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that renders the column tree into the header, footer, body
 * and sizer rows using Lit.
 */
export declare function ColumnTreeMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ColumnTreeMixinClass> & T;

export declare class ColumnTreeMixinClass {}
