/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export type Slice<T, N extends number, O extends any[] = []> = O['length'] extends N
  ? T
  : T extends [infer F, ...infer R]
    ? Slice<[...R], N, [...O, F]>
    : never;

export type WebComponentRenderer = (root: HTMLElement, ...args: any[]) => void;
