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
 * Cause a text string to be announced by screen readers.
 */
export function announce(text: string, options?: { mode?: 'alert' | 'assertive' | 'polite'; timeout?: number }): void;
