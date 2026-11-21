import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { StrictInputType } from 'storybook/internal/types';
import type { ManifestEvent, ManifestMember, ManifestType } from '../../../../api-docs/types.ts';
import { updateArgTypes } from './arg-types.ts';

const members: ManifestMember[] = [
  { kind: 'field', name: 'items', type: { text: 'SelectItem[] | null | undefined' } },
  { kind: 'field', name: 'opened', type: { text: 'boolean' } },
  { kind: 'method', name: 'requestContentUpdate' },
];

const events: ManifestEvent[] = [{ name: 'value-changed' }, { name: 'input' }];

const typeContext = {
  getMemberType(member: ManifestMember) {
    return member.kind === 'method' ? '() => void' : member.type!.text;
  },
  findRelatedTypes(type?: ManifestType) {
    return type?.text.includes('SelectItem')
      ? [{ name: 'SelectItem', declarationText: '\ninterface SelectItem {}\n' }]
      : [];
  },
  findEventType(event: ManifestEvent) {
    return event.name === 'value-changed'
      ? { name: 'SelectValueChangedEvent', declarationText: 'type SelectValueChangedEvent = CustomEvent;' }
      : undefined;
  },
};

const context = {
  typeContext,
  members,
  events,
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

  test('should keep the table of a row that the manifest does not list', () => {
    assert.deepEqual(tableTypeOf('unknown', 'properties'), { category: 'properties' });
  });

  test('should keep the table of an event without a declaration', () => {
    assert.deepEqual(tableTypeOf('input', 'events'), { category: 'events' });
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
