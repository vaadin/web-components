/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// Type-level test for the generated wrappers. It is checked by `yarn lint:types:react`
// and pins the shape of the generator output: element class export, `on<Event>` prop
// names and types, generic type parameters, and the `theme` prop of themed elements.
import { BreadcrumbsItem, type BreadcrumbsItemProps } from '../../src/BreadcrumbsItem.js';
import { Button, type ButtonProps } from '../../src/Button.js';
import { Grid, type GridProps } from '../../src/Grid.js';
import { Switch, type SwitchProps } from '../../src/Switch.js';
import {
  TextField,
  TextFieldElement,
  type TextFieldProps,
  type TextFieldValueChangedEvent,
} from '../../src/TextField.js';

const assertType = <TExpected>(value: TExpected) => value;

// Element class export
const textField: TextFieldElement = new TextFieldElement();
assertType<HTMLElement>(textField);

// Component and props
assertType<React.ReactElement | null>(TextField({ value: 'a', label: 'b' }));
const textFieldProps: TextFieldProps = {
  value: 'a',
  onValueChanged(event) {
    assertType<TextFieldValueChangedEvent>(event);
    assertType<string>(event.detail.value);
  },
};
assertType<TextFieldProps>(textFieldProps);
// @ts-expect-error: unknown props are rejected
const badProps: TextFieldProps = { nonExistingProp: true };

// Theme prop: ThemableMixin elements get it from ThemePropertyMixinClass
assertType<ButtonProps>({ theme: 'primary' });
assertType<React.ReactElement | null>(Button({ theme: 'primary' }));

// Theme prop: elements without ThemableMixin are generated with createThemedComponent
assertType<SwitchProps>({ theme: 'small' });
assertType<BreadcrumbsItemProps>({ theme: 'small' });
assertType<React.ReactElement | null>(Switch({ theme: 'small' }));
assertType<React.ReactElement | null>(BreadcrumbsItem({ theme: 'small' }));

// Generic type parameters flow into props and event types
type Item = { name: string };
const gridProps: GridProps<Item> = {
  items: [{ name: 'a' }],
  onActiveItemChanged(event) {
    assertType<Item | null | undefined>(event.detail.value);
  },
};
assertType<GridProps<Item>>(gridProps);
assertType<React.ReactElement | null>(Grid<Item>({ items: [{ name: 'a' }] }));
