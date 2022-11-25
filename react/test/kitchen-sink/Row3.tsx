import { BoardRow } from '../../src/BoardRow.js';
import { ContextMenu } from '../../src/ContextMenu.js';
import { CookieConsent } from '../../src/CookieConsent.js';
import { Crud } from '../../src/Crud.js';
import { Item } from '../../src/Item.js';
import { ListBox } from '../../src/ListBox.js';
import { crudData } from './data.js';

const menuItems = [{ text: 'Edit' }, { text: 'Delete' }];

export default function Row3() {
  return (
    <BoardRow>
      <ContextMenu items={menuItems}>
        <ListBox>
          <Item>ListBox Item</Item>
        </ListBox>
      </ContextMenu>
      <CookieConsent position="bottom-right"></CookieConsent>
      <Crud items={crudData}></Crud>
    </BoardRow>
  );
}
