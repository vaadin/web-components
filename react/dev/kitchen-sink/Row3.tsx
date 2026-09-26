import { BoardRow } from '../../packages/react-components-pro/src/BoardRow.js';
import { Checkbox } from '../../packages/react-components/src/Checkbox.js';
import { ComboBox } from '../../packages/react-components/src/ComboBox.js';
import { ContextMenu } from '../../packages/react-components/src/ContextMenu.js';
import { Crud, crudPath } from '../../packages/react-components-pro/src/Crud.js';
import { FormLayout } from '../../packages/react-components/src/FormLayout.js';
import { Item } from '../../packages/react-components/src/Item.js';
import { ListBox } from '../../packages/react-components/src/ListBox.js';
import { TextField } from '../../packages/react-components/src/TextField.js';
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
