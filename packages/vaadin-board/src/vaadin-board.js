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
import { Board } from '@vaadin/board/src/vaadin-board.js';

/**
 * @deprecated Import `Board` from `@vaadin/board` instead.
 */
export const BoardElement = Board;

export * from '@vaadin/board/src/vaadin-board.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-board" is deprecated. Use "@vaadin/board" instead.');
