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
import { TextArea } from '@vaadin/text-area/src/vaadin-text-area.js';

/**
 * @deprecated Import `TextArea` from `@vaadin/text-area` instead.
 */
export const TextAreaElement = TextArea;

export * from '@vaadin/text-area/src/vaadin-text-area.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/text-area" instead.');
