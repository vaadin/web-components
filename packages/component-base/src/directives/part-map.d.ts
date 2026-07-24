/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DirectiveResult } from 'lit/directive.js';

/**
 * A key-value set of part names to truthy values.
 */
export interface PartNameInfo {
  readonly [name: string]: string | boolean | number;
}

/**
 * A directive that applies dynamic shadow DOM part names.
 *
 * This must be used in the `part` attribute and must be the only binding in it.
 * Each property name in `partNameInfo` is added to the element's `part` list
 * if the property value is truthy, and removed if the value is falsy.
 */
export declare function partMap(partNameInfo: PartNameInfo): DirectiveResult;
