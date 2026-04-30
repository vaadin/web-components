# TypeScript

## Hand-authored `.d.ts`

Components are written in JavaScript, with TypeScript types maintained in
parallel `.d.ts` files. Two issues with TS-source authoring drove the split:

- TypeScript's mixin handling is limited — see
  [microsoft/TypeScript#17744](https://github.com/microsoft/TypeScript/issues/17744).
  Authoring mixin chains in `.ts` ends up with awkward type assertions.
- TypeScript with Lit currently requires either decorators or a `declare`
  redeclaration of every reactive property, which we consider sub-optimal
  compared to Lit's `static properties` block.

A few components have already migrated their unit tests (and occasionally
visual tests) to `.ts` — that migration is in progress, not a rule.

## Public surface

Every public component, public mixin, and public CSS export must ship a
`.d.ts`. A handful of internal sub-elements are still untyped; new ones
should always include types.

## Mixin types

Mixin functions use `Constructor<T>` from
[`@open-wc/dedupe-mixin`](https://www.npmjs.com/package/@open-wc/dedupe-mixin)
and explicitly list every mixin class they return (so that each shows up in
IDE autocomplete on the resulting element):

```ts
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';

export declare function {Name}Mixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ActiveMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<TabindexMixinClass> &
  Constructor<{Name}MixinClass> &
  T;

export declare class {Name}MixinClass {
  // Public properties / methods exposed by this mixin.
}
```

## Element types

The element `.d.ts` declares event types, an `EventMap` interface,
`addEventListener` / `removeEventListener` overrides, and augments
`HTMLElementTagNameMap`:

```ts
export type {Name}ChangeEvent = Event & { target: {Name} };
export type {Name}ValueChangedEvent = CustomEvent<{ value: string }>;

export interface {Name}EventMap extends HTMLElementEventMap {
  change: {Name}ChangeEvent;
  'value-changed': {Name}ValueChangedEvent;
}

declare class {Name} extends {Name}Mixin(ElementMixin(ThemableMixin(HTMLElement))) {
  value: string;

  addEventListener<K extends keyof {Name}EventMap>(
    type: K,
    listener: (this: {Name}, ev: {Name}EventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof {Name}EventMap>(
    type: K,
    listener: (this: {Name}, ev: {Name}EventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-{name}': {Name};
  }
}

export { {Name} };
```

## Generic components

Components that operate on data of unknown type (`grid`, `combo-box` etc)
parameterise the item type. The conventions:

- Export a default item type (`{Name}DefaultItem`) — usually `any`. It's
  the type used when the consumer doesn't supply one.
- Mixin function takes `<TItem, T extends Constructor<HTMLElement>>` and
  threads `TItem` through every returned mixin class and event-map type.
- The element's class declaration carries the type parameter with a
  default; a sibling `interface` of the same name extends the mixin
  classes (also with `<TItem>`). The split is needed because TS can't
  express both the constructor signature and the mixin extension on a
  single generic class.
- `HTMLElementTagNameMap` uses the default item type so plain
  `document.createElement('vaadin-{name}')` still types correctly.

```ts
export type {Name}DefaultItem = any;

declare class {Name}<TItem = {Name}DefaultItem> extends HTMLElement {
  addEventListener<K extends keyof {Name}EventMap<TItem>>(
    type: K,
    listener: (this: {Name}<TItem>, ev: {Name}EventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  // removeEventListener with the same shape
}

interface {Name}<TItem = {Name}DefaultItem>
  extends ElementMixinClass, ThemableMixinClass, {Name}MixinClass<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-{name}': {Name}<{Name}DefaultItem>;
  }
}
```

## Styles types

```ts
import type { CSSResult } from 'lit';

export declare const {name}Styles: CSSResult;
```

## Typings tests

Each package has `test/typings/{name}.types.ts`, type-checked by `tsc
--noEmit` from `yarn lint:types`. Their job is to lock in the public type
surface — that mixin classes show up on the element, that events have the
expected `detail` shape, and that property types are right.

```ts
import '../../vaadin-{name}.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { {Name}MixinClass } from '../../src/vaadin-{name}-mixin.js';

const assertType = <TExpected>(value: TExpected) => value;
const element = document.createElement('vaadin-{name}');

assertType<string>(element.value);
assertType<ElementMixinClass>(element);
assertType<ThemableMixinClass>(element);
assertType<{Name}MixinClass>(element);

element.addEventListener('value-changed', (event) => {
  assertType<CustomEvent>(event);
  assertType<string>(event.detail.value);
});
```
