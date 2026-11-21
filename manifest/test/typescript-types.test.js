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
  static validate(value: string): boolean;

  items: TItem[] | undefined;

  scrollDirection: 'horizontal' | 'none' | 'vertical';

  scrollToIndex(...indexes: number[]): void;

  setBounds(bounds: DOMRect, absolute?: boolean): void;

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

const element = (events, members = []) => ({
  kind: 'class',
  name: 'Field',
  customElement: true,
  tagName: 'vaadin-field',
  members,
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

  describe('members', () => {
    const fields = (...names) => names.map((name) => ({ kind: 'field', name, type: { text: 'object' } }));

    test('should set the field types', (t) => {
      const declaration = analyze(
        t,
        { 'src/vaadin-field.d.ts': FIELD_DTS },
        element([], fields('items', 'scrollDirection')),
      );
      assert.deepEqual(
        declaration.members.map((m) => m.type.text),
        ['any[] | undefined', '"horizontal" | "none" | "vertical"'],
      );
    });

    test('should set the parameter and return types of a method and keep the descriptions', (t) => {
      const method = {
        kind: 'method',
        name: 'scrollToIndex',
        parameters: [{ name: 'indexes', description: 'Row indexes', type: { text: '...number' } }],
      };
      const declaration = analyze(t, { 'src/vaadin-field.d.ts': FIELD_DTS }, element([], [method]));
      assert.deepEqual(declaration.members[0], {
        kind: 'method',
        name: 'scrollToIndex',
        parameters: [{ name: 'indexes', rest: true, type: { text: 'number[]' }, description: 'Row indexes' }],
        return: { type: { text: 'void' } },
      });
    });

    test('should mark an optional parameter', (t) => {
      const declaration = analyze(
        t,
        { 'src/vaadin-field.d.ts': FIELD_DTS },
        element([], [{ kind: 'method', name: 'setBounds' }]),
      );
      assert.deepEqual(declaration.members[0].parameters, [
        { name: 'bounds', type: { text: 'DOMRect' } },
        { name: 'absolute', optional: true, type: { text: 'boolean | undefined' } },
      ]);
    });

    test('should set the types of a static method from the class', (t) => {
      const declaration = analyze(
        t,
        { 'src/vaadin-field.d.ts': FIELD_DTS },
        element([], [{ kind: 'method', name: 'validate', static: true }]),
      );
      assert.deepEqual(declaration.members[0].parameters, [{ name: 'value', type: { text: 'string' } }]);
      assert.deepEqual(declaration.members[0].return, { type: { text: 'boolean' } });
    });

    test('should keep the declared order of union members of each element', (t) => {
      const rootDir = createTree(t, {
        'tsconfig.json': TSCONFIG,
        'src/vaadin-field.d.ts': FIELD_DTS,
        'src/vaadin-other.d.ts': `declare class Other extends HTMLElement { mode: 'auto' | 'none'; }\nexport { Other };`,
      });
      const other = {
        kind: 'class',
        name: 'Other',
        customElement: true,
        tagName: 'vaadin-other',
        members: fields('mode'),
      };
      const customElementsManifest = {
        modules: [
          { path: 'src/vaadin-field.js', declarations: [element([], fields('scrollDirection'))] },
          { path: 'src/vaadin-other.js', declarations: [other] },
        ],
      };
      typescriptTypesPlugin({ rootDir }).packageLinkPhase({ customElementsManifest });
      assert.equal(other.members[0].type.text, '"auto" | "none"');
    });

    test('should keep the JSDoc type of a member that the declaration file lacks', (t) => {
      const declaration = analyze(t, { 'src/vaadin-field.d.ts': FIELD_DTS }, element([], fields('legacy')));
      assert.deepEqual(declaration.members[0].type, { text: 'object' });
    });

    test('should keep the JSDoc type of a member that only the default library declares', (t) => {
      const declaration = analyze(t, { 'src/vaadin-field.d.ts': FIELD_DTS }, element([], fields('autocorrect')));
      assert.deepEqual(declaration.members[0].type, { text: 'object' });
    });
  });
});
