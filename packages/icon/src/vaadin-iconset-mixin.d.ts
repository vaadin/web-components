/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common iconset functionality.
 */
export declare function IconSetMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<IconMixinClass> & T;

export declare class IconMixinClass {
  /**
   * The name of the iconset. Every iconset is required to have its own unique name.
   * All the SVG icons in the iconset must have IDs conforming to its name.
   *
   * See also [`name`](#/elements/vaadin-icon#property-name) property of `vaadin-icon`.
   */
  name: string;

  /**
   * The size of an individual icon. Note that icons must be square.
   *
   * When using `vaadin-icon`, the size of the iconset will take precedence
   * over the size defined by the user to ensure correct appearance.
   */
  size: number;
}
