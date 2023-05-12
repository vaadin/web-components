import { BoardRow } from '../../src/BoardRow.js';
import { Checkbox } from '../../src/Checkbox.js';
import { ComboBox } from '../../src/ComboBox.js';
import { ContextMenu } from '../../src/ContextMenu.js';
import { CookieConsent } from '../../src/CookieConsent.js';
import { Crud, crudPath } from '../../src/Crud.js';
import { FormLayout } from '../../src/FormLayout.js';
import { Item } from '../../src/Item.js';
import { ListBox } from '../../src/ListBox.js';
import { TextField } from '../../src/TextField.js';
import { CrudRole, crudData } from './data.js';

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
      <Crud items={crudData}>
        <FormLayout slot="form">
          <TextField label="Name" {...crudPath('name')} />
          <ComboBox label="Role" items={Object.values(CrudRole)} {...crudPath('role')} />
          <Checkbox label="Active" {...crudPath('active')} />
        </FormLayout>
      </Crud>
    </BoardRow>
  );
}
