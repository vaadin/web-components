import { expect } from '@vaadin/chai-plugins';

/**
 * Asserts that the given form layout has the specified number of columns and rows.
 */
export function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children];
  expect(new Set(children.map((child) => child.offsetLeft)).size).to.equal(columns, `expected ${columns} columns`);
  expect(new Set(children.map((child) => child.offsetTop)).size).to.equal(rows, `expected ${rows} rows`);
}
