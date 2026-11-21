import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { typescriptTypesPlugin } from '../plugins/typescript-types.js';
import { createTree } from './create-tree.js';

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    target: 'es2022',
    module: 'esnext',
    moduleResolution: 'bundler',
    lib: ['es2022', 'dom'],
    strict: true,
    noEmit: true,
  },
});

const FIELD_DTS = `
export type FieldValueChangedEvent = CustomEvent<{ value: string }>;

export type FieldSelectedItemChangedEvent<TItem> = CustomEvent<{ value: TItem }>;

export type FieldChangeEvent = Event & { target: Field };

export interface FieldCustomEventMap<TItem> {
  change: FieldChangeEvent;
  resize: FieldValueChangedEvent;
  'value-changed': FieldValueChangedEvent;
  'selected-item-changed': FieldSelectedItemChangedEvent<TItem>;
  'opened-changed': CustomEvent<boolean>;
}

export type FieldEventMap<TItem> = FieldCustomEventMap<TItem> & HTMLElementEventMap;

declare class Field<TItem = any> extends HTMLElement {
  addEventListener<K extends keyof FieldEventMap<TItem>>(
    type: K,
    listener: (this: Field<TItem>, ev: FieldEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
}

export { Field };
`;

function analyze(t, files, declaration, modulePath = 'src/vaadin-field.js') {
  const rootDir = createTree(t, { 'tsconfig.json': TSCONFIG, ...files });
  const customElementsManifest = { modules: [{ path: modulePath, declarations: [declaration] }] };
  typescriptTypesPlugin({ rootDir }).packageLinkPhase({ customElementsManifest });
  return declaration;
}

const element = (events) => ({
  kind: 'class',
  name: 'Field',
  customElement: true,
  tagName: 'vaadin-field',
  events: events.map((name) => ({ name, type: { text: 'CustomEvent' } })),
});

const eventTypes = (declaration) => Object.fromEntries(declaration.events.map((e) => [e.name, e.type.text]));

describe('typescriptTypesPlugin', () => {
  describe('events', () => {
    test('should set the event types from the event map of the element', (t) => {
      const declaration = analyze(
        t,
        { 'src/vaadin-field.d.ts': FIELD_DTS },
        element(['value-changed', 'selected-item-changed', 'opened-changed']),
      );
      assert.deepEqual(eventTypes(declaration), {
        'value-changed': 'FieldValueChangedEvent',
        'selected-item-changed': 'FieldSelectedItemChangedEvent<any>',
        'opened-changed': 'CustomEvent<boolean>',
      });
    });

    test('should prefer the own event map over the default library', (t) => {
      const declaration = analyze(t, { 'src/vaadin-field.d.ts': FIELD_DTS }, element(['change', 'resize']));
      assert.deepEqual(eventTypes(declaration), { change: 'FieldChangeEvent', resize: 'FieldValueChangedEvent' });
    });

    test('should keep the type of an event that the map does not list', (t) => {
      const declaration = analyze(t, { 'src/vaadin-field.d.ts': FIELD_DTS }, element(['internal-event']));
      assert.deepEqual(eventTypes(declaration), { 'internal-event': 'CustomEvent' });
    });

    test('should skip an element without a declaration file', (t) => {
      const declaration = analyze(t, { 'src/vaadin-field.js': 'export class Field {}' }, element(['value-changed']));
      assert.deepEqual(eventTypes(declaration), { 'value-changed': 'CustomEvent' });
    });
  });
});
