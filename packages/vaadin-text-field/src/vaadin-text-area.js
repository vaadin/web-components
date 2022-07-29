/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextArea } from '@vaadin/text-area/src/vaadin-text-area.js';

/**
 * @deprecated Import `TextArea` from `@vaadin/text-area` instead.
 */
export const TextAreaElement = TextArea;

export * from '@vaadin/text-area/src/vaadin-text-area.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/text-area" instead.');
