import { ContextMenu, type ContextMenuItem } from '../../packages/react-components/src/ContextMenu.js';

const assertType = function <TExpected>(value: TExpected) {
  return value;
};

type CustomContextMenuItem = ContextMenuItem<{ value: string }>;

const items: CustomContextMenuItem[] = [{ text: 'View', value: 'view' }];

// With explicit item type
<ContextMenu
  items={items}
  onItemSelected={(e) => {
    // Base menu item properties should be available
    assertType<string | undefined>(e.detail.value.text);
    assertType<boolean | undefined>(e.detail.value.checked);
    assertType<string | undefined | string[]>(e.detail.value.theme);
    // Custom properties should be available
    assertType<string>(e.detail.value.value);
  }}
/>;

// With inferred item type
<ContextMenu
  items={[{ text: 'View', value: 'view' }]}
  onItemSelected={(e) => {
    // Base menu item properties should be available
    assertType<string | undefined>(e.detail.value.text);
    assertType<boolean | undefined>(e.detail.value.checked);
    assertType<string | undefined | string[]>(e.detail.value.theme);
    // Custom properties should be available
    assertType<string>(e.detail.value.value);
  }}
/>;
