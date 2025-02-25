import { expect } from '@vaadin/chai-plugins';

/**
 * Asserts that the given form layout has the specified number of columns and rows.
 */
export function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children];
  expect(new Set(children.map((child) => child.offsetLeft)).size).to.equal(columns, `expected ${columns} columns`);
  expect(new Set(children.map((child) => child.offsetTop)).size).to.equal(rows, `expected ${rows} rows`);
}

/**
 * Asserts that the given form layout has the specified label position.
 */
export function assertFormLayoutLabelPosition(layout, { position }) {
  const columnWidth = parseFloat(layout.columnWidth);
  const labelWidth = parseFloat(getComputedStyle(layout).getPropertyValue('--vaadin-form-layout-label-width'));
  const labelSpacing = parseFloat(getComputedStyle(layout).getPropertyValue('--vaadin-form-layout-label-spacing'));

  [...layout.children].forEach((child) => {
    if (child.localName !== 'vaadin-form-item') {
      return;
    }

    if (position === 'aside') {
      expect(child.offsetWidth).to.equal(columnWidth + labelWidth + labelSpacing, 'expected labels to be aside');
    } else {
      expect(child.offsetWidth).to.equal(columnWidth, 'expected labels to be above');
    }
  });
}
