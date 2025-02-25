import { ContextMenu, type ContextMenuItem } from '../../packages/react-components/src/ContextMenu.js';

const assertType = function <TExpected>(value: TExpected) {
  return value;
};

type CustomContextMenuItem = ContextMenuItem<{ value: string }>;

const items: CustomContextMenuItem[] = [{ text: 'View', value: 'view' }];

<ContextMenu
  items={items}
  onItemSelected={(e) => {
    // Event item type should be inferred from items
    assertType<CustomContextMenuItem>(e.detail.value);
  }}
/>;
