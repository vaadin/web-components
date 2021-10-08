/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { Crud } from '@vaadin/crud/src/vaadin-crud.js';

/**
 * @deprecated Import `Crud` from `@vaadin/crud` instead.
 */
export type CrudElement<Item> = Crud<Item>;

/**
 * @deprecated Import `Crud` from `@vaadin/crud` instead.
 */
export const CrudElement: typeof Crud;

export * from '@vaadin/crud/src/vaadin-crud.js';
