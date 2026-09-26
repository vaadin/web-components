import { MenuBar, type MenuBarItem } from '../../packages/react-components/src/MenuBar.js';

const assertType = function <TExpected>(value: TExpected) {
  return value;
};

type CustomMenuBarItem = MenuBarItem<{ value: string }>;

const items: CustomMenuBarItem[] = [{ text: 'View', value: 'view' }];

// With explicit item type
<MenuBar
  items={items}
  onItemSelected={(e) => {
    // Base menu item properties should be available
    assertType<string | undefined>(e.detail.value.text);
    assertType<string | undefined>(e.detail.value.tooltip);
    assertType<string | undefined | string[]>(e.detail.value.theme);
    // Custom properties should be available
    assertType<string>(e.detail.value.value);
  }}
/>;

// With inferred item type
<MenuBar
  items={[{ text: 'View', value: 'view' }]}
  onItemSelected={(e) => {
    // Base menu item properties should be available
    assertType<string | undefined>(e.detail.value.text);
    assertType<string | undefined>(e.detail.value.tooltip);
    assertType<string | undefined | string[]>(e.detail.value.theme);
    // Custom properties should be available
    assertType<string>(e.detail.value.value);
  }}
/>;
