/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Adds a value to an attribute containing space-delimited values.
 */
export declare function addValueToAttribute(element: HTMLElement, attr: string, value: string): void;

/**
 * Removes a value from an attribute containing space-delimited values.
 * If the value is the last one, the whole attribute is removed.
 */
export declare function removeValueFromAttribute(element: HTMLElement, attr: string, value: string): void;
