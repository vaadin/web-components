import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { addTablePipes, markdownTablesPlugin } from '../plugins/markdown-tables.js';

const lines = (...rows) => rows.join('\n');

describe('addTablePipes', () => {
  test('should add outer pipes to the rows of a table', () => {
    const markdown = lines(
      'The following parts are available:',
      '',
      'Part name | Description',
      '----------|------------',
      '`label`   | The label',
      '`input`   | The input',
      '',
      'Text after the table',
    );
    assert.equal(
      addTablePipes(markdown),
      lines(
        'The following parts are available:',
        '',
        '| Part name | Description |',
        '| ----------|------------ |',
        '| `label`   | The label |',
        '| `input`   | The input |',
        '',
        'Text after the table',
      ),
    );
  });

  test('should only add the leading pipe to a single-column table', () => {
    const markdown = lines('Custom CSS property |', ':-------------------|', '`--vaadin-size` |');
    assert.equal(
      addTablePipes(markdown),
      lines('| Custom CSS property |', '| :-------------------|', '| `--vaadin-size` |'),
    );
  });

  test('should keep a table that has outer pipes', () => {
    const markdown = lines('| Part name | Description |', '| --- | --- |', '| `label` | The label |');
    assert.equal(addTablePipes(markdown), markdown);
  });

  test('should keep a line with a pipe that is not followed by a separator', () => {
    const markdown = lines('Use `a | b` for a union type', 'of two values');
    assert.equal(addTablePipes(markdown), markdown);
  });
});

describe('markdownTablesPlugin', () => {
  test('should fix the descriptions of declarations and their items', () => {
    const table = lines('Part name | Description', '----------|------------', '`label` | The label');
    const fixed = addTablePipes(table);
    const manifest = {
      modules: [
        {
          path: 'a.js',
          declarations: [
            {
              kind: 'class',
              name: 'Button',
              description: table,
              members: [{ kind: 'field', name: 'theme', description: table }],
              cssParts: [{ name: 'label', description: 'The label' }],
            },
          ],
        },
      ],
    };
    markdownTablesPlugin().packageLinkPhase({ customElementsManifest: manifest });
    const declaration = manifest.modules[0].declarations[0];
    assert.equal(declaration.description, fixed);
    assert.equal(declaration.members[0].description, fixed);
    assert.equal(declaration.cssParts[0].description, 'The label');
  });
});
