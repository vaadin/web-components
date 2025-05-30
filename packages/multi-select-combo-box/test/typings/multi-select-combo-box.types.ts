import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type {
  ComboBoxItemMixinClass,
  ComboBoxItemRenderer,
} from '@vaadin/combo-box/src/vaadin-combo-box-item-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import type { MultiSelectComboBoxItem } from '../../src/vaadin-multi-select-combo-box-item.js';
import type { MultiSelectComboBoxMixinClass } from '../../src/vaadin-multi-select-combo-box-mixin.js';
import type {
  MultiSelectComboBox,
  MultiSelectComboBoxChangeEvent,
  MultiSelectComboBoxCustomValueSetEvent,
  MultiSelectComboBoxFilterChangedEvent,
  MultiSelectComboBoxI18n,
  MultiSelectComboBoxInvalidChangedEvent,
  MultiSelectComboBoxOpenedChangedEvent,
  MultiSelectComboBoxRenderer,
  MultiSelectComboBoxSelectedItemsChangedEvent,
  MultiSelectComboBoxValidatedEvent,
} from '../../vaadin-multi-select-combo-box.js';

interface TestComboBoxItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

const genericComboBox = document.createElement('vaadin-multi-select-combo-box');
assertType<MultiSelectComboBox>(genericComboBox);

const narrowedComboBox = genericComboBox as MultiSelectComboBox<TestComboBoxItem>;

// Events
narrowedComboBox.addEventListener('change', (event) => {
  assertType<MultiSelectComboBoxChangeEvent<TestComboBoxItem>>(event);
  assertType<MultiSelectComboBox<TestComboBoxItem>>(event.target);
});

narrowedComboBox.addEventListener('custom-value-set', (event) => {
  assertType<MultiSelectComboBoxCustomValueSetEvent>(event);
  assertType<string>(event.detail);
});

narrowedComboBox.addEventListener('filter-changed', (event) => {
  assertType<MultiSelectComboBoxFilterChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBox.addEventListener('invalid-changed', (event) => {
  assertType<MultiSelectComboBoxInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBox.addEventListener('opened-changed', (event) => {
  assertType<MultiSelectComboBoxOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBox.addEventListener('selected-items-changed', (event) => {
  assertType<MultiSelectComboBoxSelectedItemsChangedEvent<TestComboBoxItem>>(event);
  assertType<TestComboBoxItem[]>(event.detail.value);
});

narrowedComboBox.addEventListener('validated', (event) => {
  assertType<MultiSelectComboBoxValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});

// Properties
assertType<() => boolean>(narrowedComboBox.checkValidity);
assertType<() => boolean>(narrowedComboBox.validate);
assertType<boolean>(narrowedComboBox.allowCustomValue);
assertType<boolean | null | undefined>(narrowedComboBox.autoOpenDisabled);
assertType<string>(narrowedComboBox.filter);
assertType<TestComboBoxItem[] | undefined>(narrowedComboBox.filteredItems);
assertType<TestComboBoxItem[] | undefined>(narrowedComboBox.items);
assertType<(item: TestComboBoxItem) => string>(narrowedComboBox.itemClassNameGenerator);
assertType<string | null | undefined>(narrowedComboBox.itemIdPath);
assertType<string>(narrowedComboBox.itemLabelPath);
assertType<string>(narrowedComboBox.itemValuePath);
assertType<MultiSelectComboBoxI18n>(narrowedComboBox.i18n);
assertType<MultiSelectComboBoxRenderer<TestComboBoxItem> | null | undefined>(narrowedComboBox.renderer);
assertType<boolean>(narrowedComboBox.invalid);
assertType<HTMLElement | null | undefined>(narrowedComboBox.focusElement);
assertType<boolean>(narrowedComboBox.disabled);
assertType<boolean>(narrowedComboBox.clearButtonVisible);
assertType<string | null | undefined>(narrowedComboBox.errorMessage);
assertType<string>(narrowedComboBox.placeholder);
assertType<string | null | undefined>(narrowedComboBox.helperText);
assertType<boolean>(narrowedComboBox.readonly);
assertType<string | null | undefined>(narrowedComboBox.label);
assertType<boolean>(narrowedComboBox.required);
assertType<string>(narrowedComboBox.overlayClass);
assertType<boolean>(narrowedComboBox.selectedItemsOnTop);
assertType<boolean>(narrowedComboBox.autoExpandVertically);

// Mixins
assertType<ElementMixinClass>(narrowedComboBox);
assertType<DelegateFocusMixinClass>(narrowedComboBox);
assertType<DelegateStateMixinClass>(narrowedComboBox);
assertType<DisabledMixinClass>(narrowedComboBox);
assertType<FieldMixinClass>(narrowedComboBox);
assertType<FocusMixinClass>(narrowedComboBox);
assertType<InputConstraintsMixinClass>(narrowedComboBox);
assertType<InputControlMixinClass>(narrowedComboBox);
assertType<ClearButtonMixinClass>(narrowedComboBox);
assertType<Omit<InputMixinClass, 'value'>>(narrowedComboBox);
assertType<KeyboardMixinClass>(narrowedComboBox);
assertType<LabelMixinClass>(narrowedComboBox);
assertType<MultiSelectComboBoxMixinClass<TestComboBoxItem>>(narrowedComboBox);
assertType<SlotStylesMixinClass>(narrowedComboBox);
assertType<ValidateMixinClass>(narrowedComboBox);
assertType<ThemableMixinClass>(narrowedComboBox);

// Item
const genericItem = document.createElement('vaadin-multi-select-combo-box-item');
assertType<MultiSelectComboBoxItem>(genericItem);

const narrowedItem = genericItem as MultiSelectComboBoxItem<TestComboBoxItem>;

// Item properties
assertType<TestComboBoxItem>(narrowedItem.item);
assertType<number>(narrowedItem.index);
assertType<string>(narrowedItem.label);
assertType<boolean>(narrowedItem.focused);
assertType<boolean>(narrowedItem.selected);
assertType<ComboBoxItemRenderer<TestComboBoxItem, MultiSelectComboBox>>(narrowedItem.renderer);
assertType<() => void>(narrowedItem.requestContentUpdate);

// Item mixins
assertType<ComboBoxItemMixinClass<TestComboBoxItem, MultiSelectComboBox>>(narrowedItem);
assertType<DirMixinClass>(narrowedItem);
assertType<ThemableMixinClass>(narrowedItem);
