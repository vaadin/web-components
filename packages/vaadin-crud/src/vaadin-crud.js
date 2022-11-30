/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Crud } from '@vaadin/crud/src/vaadin-crud.js';

/**
 * @deprecated Import `Crud` from `@vaadin/crud` instead.
 */
export const CrudElement = Crud;

export * from '@vaadin/crud/src/vaadin-crud.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-crud" is deprecated. Use "@vaadin/crud" instead.');
