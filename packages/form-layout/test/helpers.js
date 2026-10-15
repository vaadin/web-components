import { expect } from '@vaadin/chai-plugins';

/**
 * Asserts that the given form layout has the specified number of columns and rows.
 */
export function assertFormLayoutGrid(layout, { columns, rows }) {
  const children = [...layout.children]
    .flatMap((child) => (child.localName === 'vaadin-form-row' ? [...child.children] : child))
    .filter((child) => child.localName !== 'br');
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

    const label = child.querySelector('[slot=label]');
    const input = child.querySelector(':not([slot])');

    if (position === 'aside') {
      expect(child.offsetWidth).to.equal(
        columnWidth + labelWidth + labelSpacing,
        'expected column to have width equal to columnWidth + labelWidth + labelSpacing',
      );
      expect(label.offsetLeft).to.be.below(input.offsetLeft, 'expected label to be displayed aside input');
    } else {
      expect(child.offsetWidth).to.equal(columnWidth, 'expected column to have width equal to columnWidth');
      expect(label.offsetTop).to.be.below(input.offsetTop, 'expected label to be displayed above input');
    }
  });
}
