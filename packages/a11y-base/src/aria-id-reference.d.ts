/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Update `aria-describedby` attribute value on the given element.
 */
export declare function setAriaDescribedBy(target: HTMLElement, newId: string, oldId?: string): void;

/**
 * Removes the current `aria-labelledby` attribute value on the given element.
 */
export function removeAriaLabelledBy(target: HTMLElement): void;

/**
 * Restore the generated `aria-labelledby` attribute value on the given element.
 */
export function restoreGeneratedAriaLabellledBy(target: HTMLElement): void;

/**
 * Update `aria-labelledby` attribute value on the given element.
 */
export declare function setAriaLabelledBy(target: HTMLElement, newId: string, oldId?: string, fromUser?: boolean): void;
