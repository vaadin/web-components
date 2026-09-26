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
import { Board as _Board } from './generated/Board.js';

export * from './generated/Board.js';

/**
 * @deprecated Board is deprecated and will be removed in Vaadin 26.
 * Consider using Dashboard or DashboardLayout as an alternative.
 */
export const Board = _Board;
