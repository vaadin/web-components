/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Removes the current `aria-describedby` attribute value on the given element.
 */
export function removeAriaDescribedBy(target: HTMLElement): void;

/**
 * Restore the generated `aria-describedby` attribute value on the given element.
 */
export function restoreGeneratedAriaDescribedBy(target: HTMLElement): void;

/**
 * Update `aria-describedby` attribute value on the given element.
 */
export declare function setAriaDescribedBy(
  target: HTMLElement,
  newId: string,
  oldId?: string,
  fromUser?: boolean,
): void;

/**
 * Removes the current `aria-labelledby` attribute value on the given element.
 */
export function removeAriaLabelledBy(target: HTMLElement): void;

/**
 * Restore the generated `aria-labelledby` attribute value on the given element.
 */
export function restoreGeneratedAriaLabelledBy(target: HTMLElement): void;

/**
 * Update `aria-labelledby` attribute value on the given element.
 */
export declare function setAriaLabelledBy(target: HTMLElement, newId: string, oldId?: string, fromUser?: boolean): void;
