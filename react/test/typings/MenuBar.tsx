import { MenuBar, type MenuBarItem } from '../../packages/react-components/src/MenuBar.js';

const assertType = function <TExpected>(value: TExpected) {
  return value;
};

type CustomMenuBarItem = MenuBarItem<{ value: string }>;

const items: CustomMenuBarItem[] = [{ text: 'View', value: 'view' }];

<MenuBar
  items={items}
  onItemSelected={(e) => {
    // Event item type should be inferred from items
    assertType<CustomMenuBarItem>(e.detail.value);
  }}
/>;
