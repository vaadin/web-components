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
import type { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

/**
 * @deprecated Import `TextField` from `@vaadin/text-field` instead.
 */
export type TextFieldElement = TextField;

/**
 * @deprecated Import `TextField` from `@vaadin/text-field` instead.
 */
export const TextFieldElement: typeof TextField;

export * from '@vaadin/text-field/src/vaadin-text-field.js';
