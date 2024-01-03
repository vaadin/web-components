/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/**
 * Convenience utility for capitalizing a string, with
 * replacing non-alphanumeric characters with spaces.
 */
export function capitalize(path: string): string;

/**
 * Convenience method for reading a value from a path.
 */
export function getProperty(path: string, obj: Record<string, unknown>): unknown;

/**
 * Convenience utility for setting a value to a path.
 *
 * Note, if any part in the path is undefined, this
 * function initializes it with an empty object.
 */
export function setProperty(path: string, value: unknown, obj: Record<string, unknown>): void;
