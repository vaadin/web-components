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
import type { Crud } from '@vaadin/crud/src/vaadin-crud.js';

/**
 * @deprecated Import `Crud` from `@vaadin/crud` instead.
 */
export type CrudElement<Item> = Crud<Item>;

/**
 * @deprecated Import `Crud` from `@vaadin/crud` instead.
 */
export const CrudElement: typeof Crud;

export * from '@vaadin/crud/src/vaadin-crud.js';
