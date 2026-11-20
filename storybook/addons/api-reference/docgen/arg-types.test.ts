import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { StrictInputType } from 'storybook/internal/types';
import { updateArgTypes } from './arg-types.ts';

const MEMBER_TYPES = new Map([
  ['items', 'SelectItem[] | null | undefined'],
  ['opened', 'boolean'],
  ['requestContentUpdate', '() => void'],
]);

const typeContext = {
  getMemberType(name: string) {
    const type = MEMBER_TYPES.get(name);
    if (!type) {
      throw new Error(`no member ${name}`);
    }
    return type;
  },
  findRelatedTypes(type: string) {
    return type.includes('SelectItem') ? [{ name: 'SelectItem', declarationText: '\ninterface SelectItem {}\n' }] : [];
  },
  findEventType(name: string) {
    return name === 'value-changed'
      ? { name: 'SelectValueChangedEvent', declarationText: 'type SelectValueChangedEvent = CustomEvent;' }
      : undefined;
  },
};

const context = {
  tagName: 'vaadin-select',
  typeContext,
  fixLinks: (markdown: string) => markdown.replace('/elements/vaadin-select', ''),
};

function tableTypeOf(name: string, category: string): StrictInputType['table'] {
  const argType: StrictInputType = { name, type: { name: 'other', value: '' }, table: { category } };
  return updateArgTypes({ [name]: argType }, context)[name].table;
}

describe('updateArgTypes', () => {
  test('should add the property type with the related type declarations', () => {
    assert.deepEqual(tableTypeOf('items', 'properties')?.type, {
      summary: 'SelectItem[] | null | undefined',
      detail: 'interface SelectItem {}',
    });
  });

  test('should add the property type without detail when there are no related types', () => {
    assert.deepEqual(tableTypeOf('opened', 'properties')?.type, { summary: 'boolean' });
  });

  test('should add the method signature', () => {
    assert.deepEqual(tableTypeOf('requestContentUpdate', 'methods')?.type, { summary: '() => void' });
  });

  test('should add the event type with its declaration', () => {
    assert.deepEqual(tableTypeOf('value-changed', 'events')?.type, {
      summary: 'SelectValueChangedEvent',
      detail: 'type SelectValueChangedEvent = CustomEvent;',
    });
  });

  test('should keep the table of a category without TypeScript types', () => {
    assert.deepEqual(tableTypeOf('prefix', 'slots'), { category: 'slots' });
  });

  test('should keep the table when the type lookup fails', () => {
    assert.deepEqual(tableTypeOf('unknown', 'properties'), { category: 'properties' });
  });

  test('should rewrite the links in the description', () => {
    const argType: StrictInputType = {
      name: 'items',
      type: { name: 'other', value: '' },
      description: 'See [items](/elements/vaadin-select#items).',
    };
    assert.equal(updateArgTypes({ items: argType }, context).items.description, 'See [items](#items).');
  });
});
