import '../../vaadin-select.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ListMixinClass } from '@vaadin/a11y-base/src/list-mixin.js';
import type { TabindexMixinClass } from '@vaadin/a11y-base/src/tabindex-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { SelectItem } from '../../src/vaadin-select-item.js';
import type { SelectListBox } from '../../src/vaadin-select-list-box.js';
import type {
  Select,
  SelectChangeEvent,
  SelectInvalidChangedEvent,
  SelectItem as Item,
  SelectOpenedChangedEvent,
  SelectRenderer,
  SelectValidatedEvent,
  SelectValueChangedEvent,
} from '../../vaadin-select.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const select: Select = document.createElement('vaadin-select');

// Properties
assertType<Item[] | null | undefined>(select.items);
assertType<boolean>(select.opened);
assertType<SelectRenderer | undefined>(select.renderer);
assertType<string>(select.value);
assertType<string | null | undefined>(select.placeholder);
assertType<boolean>(select.readonly);
assertType<boolean>(select.invalid);
assertType<boolean>(select.required);
assertType<() => void>(select.requestContentUpdate);
assertType<() => boolean>(select.validate);

// Mixins
assertType<DelegateFocusMixinClass>(select);
assertType<DelegateStateMixinClass>(select);
assertType<DisabledMixinClass>(select);
assertType<FieldMixinClass>(select);
assertType<FocusMixinClass>(select);
assertType<KeyboardMixinClass>(select);
assertType<LabelMixinClass>(select);
assertType<TabindexMixinClass>(select);
assertType<ThemableMixinClass>(select);
assertType<ValidateMixinClass>(select);

// Item properties
const item: Item = select.items ? select.items[0] : {};
assertType<string | undefined>(item.label);
assertType<string | undefined>(item.value);
assertType<boolean | undefined>(item.disabled);
assertType<string | undefined>(item.component);
assertType<string | undefined>(item.className);

// Events
select.addEventListener('change', (event) => {
  assertType<SelectChangeEvent>(event);
  assertType<Select>(event.target);
});

select.addEventListener('opened-changed', (event) => {
  assertType<SelectOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

select.addEventListener('invalid-changed', (event) => {
  assertType<SelectInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

select.addEventListener('value-changed', (event) => {
  assertType<SelectValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

select.addEventListener('validated', (event) => {
  assertType<SelectValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});

const renderer: SelectRenderer = (root, owner) => {
  assertType<HTMLElement>(root);
  assertType<Select>(owner);
};

select.renderer = renderer;

// Item
const option = document.createElement('vaadin-select-item');

assertType<SelectItem>(option);
assertType<ItemMixinClass>(option);
assertType<DirMixinClass>(option);
assertType<ThemableMixinClass>(option);

// Item
const listBox = document.createElement('vaadin-select-list-box');

assertType<SelectListBox>(listBox);
assertType<ListMixinClass>(listBox);
assertType<DirMixinClass>(listBox);
assertType<ThemableMixinClass>(listBox);
