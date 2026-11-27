import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { ElementDeclaration } from '../lib/cem-helpers.ts';
import { createLitWebTypes, createPlainWebTypes } from '../lib/web-types.ts';

const PACKAGE_JSON = { name: '@vaadin/x', version: '1.2.3' };

const element = (): ElementDeclaration => ({
  kind: 'class',
  customElement: true,
  name: 'X',
  tagName: 'vaadin-x',
  description: 'See [`<vaadin-y>`](#/elements/vaadin-y).',
  attributes: [
    { name: 'opened', type: { text: 'boolean' }, default: 'false', description: 'Opened' },
    { name: 'class' },
    { name: 'label', type: { text: 'string | null | undefined' } },
  ],
  members: [
    { kind: 'field', name: 'value', type: { text: 'string' }, default: "''", description: 'Value' },
    { kind: 'field', name: 'opened', type: { text: 'boolean' } },
    { kind: 'field', name: 'size', type: { text: 'number' }, readonly: true },
    { kind: 'field', name: 'theme', type: { text: 'string' }, deprecated: 'Use `variant`' },
    { kind: 'method', name: 'open' },
  ],
  events: [{ name: 'value-changed', type: { text: 'CustomEvent' }, description: 'Fired on change' }],
});

describe('createPlainWebTypes', () => {
  test('should write the attributes, properties and events of an element', () => {
    assert.deepEqual(createPlainWebTypes(PACKAGE_JSON, [element()]), {
      $schema: 'https://json.schemastore.org/web-types',
      name: '@vaadin/x',
      version: '1.2.3',
      'description-markup': 'markdown',
      contributions: {
        html: {
          elements: [
            {
              name: 'vaadin-x',
              description:
                'See [`<vaadin-y>`](https://cdn.vaadin.com/vaadin-web-components/1.2.3/#/elements/vaadin-y).',
              attributes: [
                { name: 'label', description: '', value: { type: ['string', 'null', 'undefined'] } },
                { name: 'opened', description: 'Opened', value: { type: ['boolean'] }, default: 'false' },
              ],
              js: {
                properties: [
                  { name: 'opened', description: '', value: { type: ['boolean'] } },
                  { name: 'theme', description: '', value: { type: ['string'] }, deprecated: 'Use `variant`' },
                  { name: 'value', description: 'Value', value: { type: ['string'] }, default: "''" },
                ],
                events: [{ name: 'value-changed', description: 'Fired on change' }],
              },
            },
          ],
        },
      },
    });
  });

  test('should mark a deprecated element', () => {
    const webTypes = createPlainWebTypes(PACKAGE_JSON, [{ ...element(), deprecated: true }]);
    assert.equal(webTypes.contributions.html!.elements![0].deprecated, true);
  });
});

describe('createLitWebTypes', () => {
  test('should write the property and event bindings of an element as attributes', () => {
    assert.deepEqual(createLitWebTypes(PACKAGE_JSON, [element()]), {
      $schema: 'https://json.schemastore.org/web-types',
      name: '@vaadin/x',
      version: '1.2.3',
      'description-markup': 'markdown',
      framework: 'lit',
      'framework-config': {
        'enable-when': {
          'node-packages': ['lit'],
        },
      },
      contributions: {
        html: {
          elements: [
            {
              name: 'vaadin-x',
              description:
                'See [`<vaadin-y>`](https://cdn.vaadin.com/vaadin-web-components/1.2.3/#/elements/vaadin-y).',
              extension: true,
              attributes: [
                { name: '?opened', description: '', value: { kind: 'expression' } },
                { name: '.theme', description: '', value: { kind: 'expression' }, deprecated: 'Use `variant`' },
                { name: '.value', description: 'Value', value: { kind: 'expression' } },
                { name: '@value-changed', description: 'Fired on change', value: { kind: 'expression' } },
              ],
            },
          ],
        },
      },
    });
  });
});
