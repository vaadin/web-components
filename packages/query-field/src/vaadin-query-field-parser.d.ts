/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export type QueryFieldSegment = {
  type: 'filter' | 'space' | 'text';
  start: number;
  end: number;
  raw: string;
  name?: string;
  value?: string;
  valueStart?: number;
  quoted?: boolean;
  closed?: boolean;
};

export declare function parseQuery(text: string): QueryFieldSegment[];

export declare function formatFilterValue(value: string): string;
