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
import type { Board } from '@vaadin/board/src/vaadin-board.js';

/**
 * @deprecated Import `Board` from `@vaadin/board` instead.
 */
export type BoardElement = Board;

/**
 * @deprecated Import `Board` from `@vaadin/board` instead.
 */
export const BoardElement: typeof Board;

export * from '@vaadin/board/src/vaadin-board.js';
