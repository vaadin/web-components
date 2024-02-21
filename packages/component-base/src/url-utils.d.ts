/**
 * @license
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Checks if two paths match based on their origin, pathname, and query parameters.
 *
 * The function matches an actual path against an expected path to see if they share the same
 * base origin (like https://example.com), the same path (like /path/to/page), and if the
 * actual path contains all query parameters from the expected path.
 */
export declare function matchPaths(actual: string, expected: string): boolean;
