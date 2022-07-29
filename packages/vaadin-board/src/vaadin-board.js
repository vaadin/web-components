/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { Board } from '@vaadin/board/src/vaadin-board.js';

/**
 * @deprecated Import `Board` from `@vaadin/board` instead.
 */
export const BoardElement = Board;

export * from '@vaadin/board/src/vaadin-board.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-board" is deprecated. Use "@vaadin/board" instead.');
