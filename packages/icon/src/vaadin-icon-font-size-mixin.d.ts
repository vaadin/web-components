/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * Mixin which enables the font icon sizing fallback for browsers that do not support CSS Container Queries.
 * In older versions of Safari, it didn't support Container Queries units used in pseudo-elements. It has been fixed in
 * recent versions, but there's an regression in Safari 26, which caused the same issue to happen when the icon is
 * attached to an element with shadow root.
 * The mixin does nothing if the browser supports CSS Container Query units for pseudo elements.
 */
export declare function IconFontSizeMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<IconFontSizeMixinClass> & T;

export declare class IconFontSizeMixinClass {}
